import { summariseCommit } from '@/lib/github';
import { NextResponse } from 'next/server';
import { pollCommits} from "@/lib/github";
import { aiSummariseCommit, generateEmbedding } from '@/lib/gemini';
import { loadGithubRepo } from '@/lib/github-loader';
import { processMeeting } from '@/lib/assembly';


const projectId = '0361c31e-9c6d-47d0-8c53-fec8d9e9c81a';
const githubUrl = 'https://github.com/MohammedIhsaan28/PriChat';
const commitHash = 'https://github.com/MohammedIhsaan28/PriChat/6bd448b715ff4a29e5d94ae7537101b8ff46d393';

// export async function GET(){
//     const gemini = await pollCommits(projectId);
//     return NextResponse.json({gemini});
// }

// export async function GET(){
//     const data = await loadGithubRepo(githubUrl);
//     return NextResponse.json({data});
// }
// export async function GET(){
//     const data = await generateEmbedding("hello world");
//     return NextResponse.json(data);
// }

// export async function GET(){
//     const test = await summariseCommit(githubUrl, commitHash);
//     return NextResponse.json({test});
// }

// export async function GET(){
//     const test = await aiSummariseCommit(commitHash);
//     return NextResponse.json({test});
// }

export async function GET(){
    const meeting = await processMeeting('https://assembly.ai/sports_injuries.mp3');
    return NextResponse.json({meeting});
}

// {
// "pageContent": "# Sea https://help.github.com/articles/ignoring-files/ for more about ignor files. # dependencies /node_modules /.pnp .pnp.* .yarn/* !.yarn/patches !.yarn/plugins !.yarn/releases !.yarn/versions # testing /coverage # next.js /.next/ /out/ # production / swild # misc .DS_Store *.pem # debug npm debug.log* yarn-debug.log* yarn-error.log* .pnpm debug.log* # env files (can opt-in for committing if noded) .env* # farcel .vercel # typecript *.tsbuildinfo next-env.d.ts ",
// "metadata": {
// "source": ".gitignore",
// "repository": "https://github.com/MohammedIhsaan28/PriChat",
// "branch": "main"
// }
// },