
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summariseCode } from "./gemini";
import db from "./db";
import { Octokit } from "octokit";

// Helper to process items in batches with concurrency limit
async function processBatch<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  concurrency: number = 5
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((item, idx) => processor(item, i + idx))
    );
    batchResults.forEach((result, idx) => {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        console.error(`Failed to process item ${i + idx}:`, result.reason);
      }
    });
  }
  return results;
}

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string
) => {
  const loaderConfig: any = {
    branch: "main",
    ignoreFiles: [
      "**/node_modules/**",
      "**/.git/**",
      "**/.next/**",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
      "**/dist/**",
      "**/build/**",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  };

  // Only add accessToken if provided (empty string causes unauthenticated requests)
  if (githubToken && githubToken.trim() !== "") {
    loaderConfig.accessToken = githubToken;
  } else if (process.env.GITHUB_TOKEN) {
    // Fallback to environment variable if no token provided
    loaderConfig.accessToken = process.env.GITHUB_TOKEN;
    console.log("Using GITHUB_TOKEN from environment variables");
  } else {
    console.warn(
      "No GitHub token provided - requests will be rate limited (60/hour). Provide a token for 5000/hour limit."
    );
  }

  const loader = new GithubRepoLoader(githubUrl, loaderConfig);
  const docs = await loader.load();
  return docs;
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string
) => {
  try {
    const docs = await loadGithubRepo(githubUrl, githubToken);

    const allEmbeddings = await processBatch(
      docs,
      async (doc) => {
        try {
          const summary = await summariseCode(doc);
          const embedding = await generateEmbedding(summary || 'Error');
          return {
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source,
          };
        } catch (error) {
          console.error(`Failed to process ${doc.metadata.source}:`, error);
          return null;
        }
      },
      5 // Process 5 files at a time
    );

    // Filter out failed embeddings
    const validEmbeddings = allEmbeddings.filter((e) => e !== null);
    console.log(
      `Generated ${validEmbeddings.length} embeddings, saving to database...`
    );

    // Save to database in batches
    await processBatch(
      validEmbeddings,
      async (embedding) => {
        if (!embedding) return;

        // Format the embedding array as a vector string [0.1,0.2,...]
        const vectorString = `[${embedding?.embedding?.join(",")}]`;

        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
          data: {
            summary: embedding.summary ?? "No summary available",
            sourceCode: embedding.sourceCode,
            fileName: embedding.fileName,
            projectId,
          },
        });

        await db.$executeRaw`
                UPDATE "SourceCodeEmbedding"
                SET "summaryEmbedding" = ${vectorString}::vector
                WHERE "id" = ${sourceCodeEmbedding.id}`;
      },
      10 // Save 10 at a time
    );

    console.log(
      `Successfully indexed ${validEmbeddings.length} files for project ${projectId}`
    );
  } catch (error) {
    console.error(
      `Failed to index GitHub repo for project ${projectId}:`,
      error
    );
    throw error;
  }
};

const getFileCount = async (path:string, octokit: Octokit, githubOwner:string,githubRepo:string,acc:number = 0)=>{
    const {data} = await octokit.rest.repos.getContent({
      owner: githubOwner,
      repo: githubRepo,
      path
    })
    if(!Array.isArray(data) && data.type === 'file'){
      return acc + 1;
    }

    if(Array.isArray(data)){
      let fileCount =0 
      const directories: string[] =[];
      
      for (const item of data){
        if(item.type === 'dir'){
          directories.push(item.path)
        } else {
          fileCount++
        }
      }
      if(directories.length >0){
        const directoryCounts = await Promise.all(
          directories.map(dirPath => getFileCount(dirPath, octokit,githubOwner,githubRepo,0))
        )
        fileCount += directoryCounts.reduce((acc,count) => acc+count,0)
      }
      return acc+ fileCount;
    }

    return acc

}

export const checkCredits = async (githubUrl:string,githubToken?:string)=>{

  const octokit = new Octokit({auth: githubToken});
  const githubOwner = githubUrl.split('/')[3];
  const githubRepo = githubUrl.split('/')[4];
  if(!githubOwner || !githubRepo){
    return 0
  }

  const fileCount = await getFileCount('',octokit, githubOwner,githubRepo,0);
  return fileCount;
}