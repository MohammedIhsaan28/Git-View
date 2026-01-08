"use client";

import { trpc } from "@/app/_trpc/client";
import useProject from "@/hooks/use-project";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CommitLogs() {
  const { projectId, project } = useProject();
  const { data: commits } = trpc.project.getCommits.useQuery({ projectId });

  return (
    <div className="w-full overflow-hidden">
      <ul className="space-y-6">
        {commits?.map((commit, idx) => (
          <li key={commit.id} className="relative flex items-start gap-4 min-h-[72px]">

            {/* Git connector line */}
            {idx < commits.length - 1 && (
              <div className="absolute left-[16px] top-[56px] h-[calc(100%-16px)] w-[2px] bg-gray-200 rounded-md" />
            )}

            {/* Avatar */}
            <div className="flex-none ">
              <Image
                src={commit.commitAuthorAvatar}
                alt="commit avatar"
                width={32}
                height={32}
                className="mt-4 rounded-full object-cover aspect-square"
                style={{ minWidth: 32, minHeight: 32, maxWidth: 32, maxHeight: 32 }}
              />
            </div>

            {/* Commit Card */}
            <div className="w-[500px] max-w-full mt-4 p-4 rounded-md shadow bg-white ring-1 ring-gray-200">

              {/* Author + committed + ExternalLink */}
              <div className="flex items-center text-xs text-gray-500 gap-x-1">
                <span className="font-semibold text-gray-900 text-sm ">
                  {`${commit.commitAuthorName} `}
                </span>

                <span className="text-gray-400 text-sm ">(committed)</span>
                <Link
                  href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                  target="_blank"
                  className="inline-flex items-center text-blue-600 hover:underline gap-x-1 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Commit message */}
              <p className="font-semibold text-sm mt-2 p-2 ml-2 border border-primary rounded-md ">{commit.commitMessage}</p>

              {/* Gap between message and summary */}
              <div className="mt-3"></div>

              {/* Summary in Markdown but forced text-sm */}
              <div className="text-sm prose border  rounded-md prose-sm ml-2 p-4 italic text-gray-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {commit.summary}
                </ReactMarkdown>
              </div>

              {/* Vertical gap after summary */}
              <div className="mt-3"></div>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
