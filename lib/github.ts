import { Octokit } from 'octokit';
import db from './db';
import axios from 'axios';
import { aiSummariseCommit } from './gemini';

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

type Response = {
    commitHash : string;
    commitMessage : string;
    commitAuthorName : string;
    commitAuthorAvatar : string;
    commitDate : string;
}

export const getCommitHashes = async (githubUrl : string) : Promise<Response[]> => {
    //https://github.com/docker/genai-stack
    const [owner,repo] = githubUrl.split('/').slice(-2);
    if(!owner || !repo){
        throw new Error('Invalid GitHub URL');
    };
    const {data} = await octokit.rest.repos.listCommits({
        owner,
        repo,
    });
    const sortedCommits = [...data].sort((a, b) => {
    const dateA = a.commit?.author?.date ? new Date(a.commit.author.date).getTime() : 0;
    const dateB = b.commit?.author?.date ? new Date(b.commit.author.date).getTime() : 0;
    return dateB - dateA;
  });

  return sortedCommits.slice(0, 10).map((commit) => ({
    commitHash: commit.sha,
    commitMessage: commit.commit?.message ?? "",
    commitAuthorName: commit.commit?.author?.name ?? "",
    commitAuthorAvatar: commit.author?.avatar_url ?? "",
    commitDate: commit.commit?.author?.date ?? "",
  }));
}

export const pollCommits = async (projectId: string) => {
    const { project, githubUrl} = await fetchProjectGithubUrl(projectId);
    const commitHashes = await getCommitHashes(githubUrl);
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);
    const summaryResponse = await Promise.allSettled(unprocessedCommits.map(commit=> {
        return summariseCommit(githubUrl, commit.commitHash);
    }))

    

    const summaries = summaryResponse.map((response) => {
        if(response.status === 'fulfilled'){
            return response.value.summary as string;
        }
        return 'summary not available';
    });

    

    const commits = await db.commit.createMany({
        data: summaries.map((summary,index)=> {
            console.log(`processing commits ${index}`);
            return {
                projectId: projectId,
                commitHash: unprocessedCommits[index].commitHash,
                commitMessage: unprocessedCommits[index].commitMessage,
                commitAuthorName: unprocessedCommits[index].commitAuthorName,
                commitAuthorAvatar: unprocessedCommits[index].commitAuthorAvatar,
                commitDate: unprocessedCommits[index].commitDate,
                summary,
            }
        })
    })
    return commits;
}

async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where:{
            id: projectId
        },
        select:{
            githubUrl: true
        }
    })
    if(!project?.githubUrl){
        throw new Error('Project GitHub URL not found');
    }
    return { project, githubUrl: project.githubUrl };
}

async function filterUnprocessedCommits(projectId:string,commitHashes:Response[]){
    const processedCommits = await db.commit.findMany({
        where:{
            projectId
        }
    })
    const unprocessedCommits = commitHashes.filter((commit)=> !processedCommits.some(processedCommit => processedCommit.commitHash === commit.commitHash));
    return unprocessedCommits;
}

export async function summariseCommit(githubUrl:string, commitHash: string){
    const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`,{
        headers:{
            Accept :'application/vnd.github.v3.diff'
        }
    })
    return await aiSummariseCommit(data) || '';
}