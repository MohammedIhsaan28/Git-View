'use client';

import { useState } from "react";
import useProject from "@/hooks/use-project";
import { Dialog,DialogHeader,DialogContent,DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function InviteButton() {
    const {projectId} = useProject();
    const [open,setOpen] = useState(false);
    return(
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <div className='flex items-center justify-center'>
                    <DialogContent >
                    <DialogHeader>
                        <DialogTitle>Invite Team Members</DialogTitle>
                        <DialogDescription>Ask them to copy and paste this link</DialogDescription>
                    </DialogHeader>
                    
                    <Input className="mt-4"
                        readOnly
                        onClick={()=>{
                            navigator.clipboard.writeText(`${window.location.origin}/join/${projectId}`);
                            toast.success('Copied to clipboard')
                        }}
                        value={`${window.location.origin}/join/${projectId}`}
                    />
                
                </DialogContent>


                </div>
                
            </Dialog>

            <Button size={'sm'} className="bg-primary" onClick={()=> setOpen(true)}>
                Invite Members

            </Button>
          

        
        
        </>


    )
}