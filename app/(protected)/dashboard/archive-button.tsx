'use client';

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useProject from "@/hooks/use-project";
import useRefetch from "@/hooks/use-refetch";
import { useState } from "react";
import { toast } from "sonner";

export default function ArchiveButton() {
    const {projectId} = useProject();
    const archiveProject = trpc.project.archieveProject.useMutation();
    const refetch = useRefetch();
    const [open,setOpen] = useState(false);
    return(
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <div className='flex items-center justify-center'>
                    <DialogContent >
                    <DialogHeader>
                        <DialogTitle>Delete Project</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this project?</DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex justify-end gap-3">
                        <Button variant={'destructive'} onClick={()=> {
                            archiveProject.mutate({projectId},{
                                onSuccess: () => {
                                    toast.success('Project deleted!');
                                    refetch();
                                    setOpen(false);
                                },
                                onError: () => {
                                    toast.error('Failed to delete project!');
                                    setOpen(false);
                                }
                                
                            })
                        }}>
                        Confirm
                    </Button>
                    <Button variant="secondary" onClick={()=> setOpen(false)}>
                        Cancel
                    </Button>

                    </div>
                    
                
                </DialogContent>


                </div>
                
            </Dialog>
        

        <Button disabled={archiveProject.isPending} size={'sm'} variant={'destructive'} onClick={()=> {
            setOpen(true);
        
        }}>
            Archive
              
        </Button>
</>
      
    )
}

    // if(confirm){             
    //              const confirm = window.confirm("Are you sure you want to archieve this project");
    //             archiveProject.mutate({projectId},{
    //                 onSuccess: ()=> {
    //                     toast.success('Project archive!');
    //                     refetch();
    //                 },
    //                 onError: ()=> {
    //                     toast.error('Failed to archive project!')
    //                 }
    //             })
    //         }