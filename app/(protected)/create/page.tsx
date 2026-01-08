"use client";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";
import { FileText, Github, Info, Key } from "lucide-react";

type formInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string | undefined;
};

export default function CreatePage() {
  const { register, handleSubmit, reset } = useForm<formInput>();
  const createProject = trpc.project.createProject.useMutation();
  const checkCredits = trpc.project.checkCredits.useMutation();
  const refetch = useRefetch();
  function onSubmit(data: formInput) {

    if(!!checkCredits.data){
      createProject.mutate({
        name: data.projectName,
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
    },
    {
        onSuccess:()=>{
            toast.success("Project created successfully");
            refetch();
            reset();
        },
        onError:()=>{
            toast.error("Failed to create project");
        }
    }
);
      return true;

    } else{
      checkCredits.mutate({
        githubUrl: data.repoUrl,
        githubToken: data.githubToken
      })
    }
  }
  const hasEnoughCredits = checkCredits?.data?.userCredits ? checkCredits.data.fileCount <= checkCredits.data.userCredits : true;
  return (
    <div className="flex items-center gap-12 justify-center h-full ">
      <Image
        src="/version_logo.svg"
        alt="Version Logo"
        width={300}
        height={300}
      />
      <div className="">
        <div>
          <h1 className="text-2xl font-semibold mb-4">
            Link your Github Repository
          </h1>
          <p className="mb-4 text-sm text-muted-foreground">
            Enter the URL of your Github repository to get started.
          </p>
        </div>
        <div className="h-4"></div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            
            <Input
              {...register("projectName", { required: true,setValueAs: (value) => value.trim(), })}
              placeholder="Project Name"
              required
            />

            <div className="h-2"></div>

            <Input
              {...register("repoUrl", {
                required: true,
                setValueAs: (value) => value.trim(),
                pattern: {
                  value:
                    /^(https:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\/)?$/,
                  message: "Invalid GitHub repository URL",
                },
              })}
              placeholder="Github Repository URL"
              type="url"
              required
            />

            <div className="h-2"></div>
            
            <Input
              {...register("githubToken", { required: false,setValueAs: (value) => value.trim(), })}
              placeholder="Github Token (optional)"
            />
            <div className="h-4"></div>

            {!!checkCredits.data && (
              <>
                <div className="mt-2 bg-green-50 px-4 py-2 rounded-md border border-green-200 text-green-700">
                  <div className="flex items-center gap-1">
                    <Info className="size-4"/>
                    <p className="text-sm italic">You will be charged <strong>{checkCredits.data?.fileCount}</strong> credits for this repository</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Key className="size-4"/>
                  <p className='text-sm font-semibold text-emerald-600'>You have <strong>{checkCredits.data?.userCredits}</strong> credits remaining</p>

                  </div>
                  

                </div>
              
              </>

            )}
              
            <Button className="mt-4" type="submit" disabled={createProject.isPending || checkCredits.isPending || !hasEnoughCredits}>
              {!!checkCredits.data ? 'Create Proect' : 'Check Credits'}
              
              </Button>
              

          </form>
        </div>
      </div>
    </div>
  );
}
