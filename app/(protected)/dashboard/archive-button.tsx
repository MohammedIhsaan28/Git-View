'use client';

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import useRefetch from "@/hooks/use-refetch";
import { toast } from "sonner";
import DeleteConfirmDialog from "@/components/ui/deleteDialog";

export default function ArchiveButton() {
    const {projectId} = useProject();
    const archiveProject = trpc.project.archieveProject.useMutation();
    const refetch = useRefetch();
    return(
        <Button disabled={archiveProject.isPending} size={'sm'} variant={'destructive'} onClick={()=> {
            const confirm = window.confirm("Are you sure you want to archieve this project");
            if(confirm){
                archiveProject.mutate({projectId},{
                    onSuccess: ()=> {
                        toast.success('Project archive!');
                        refetch();
                    },
                    onError: ()=> {
                        toast.error('Failed to archive project!')
                    }
                })
            }
        }}>
            Archive
              
        </Button>

      
    )
}