'use client';

import { trpc } from "@/app/_trpc/client";
import { VideoIcon } from "lucide-react";
import { RouterOutputs } from "@/types/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogHeader, DialogTitle,DialogContent, DialogDescription } from "@/components/ui/dialog";

type Props = {
    meetingId: string
}

export default function IssuesList({meetingId}: Props){
    const {data: meeting, isLoading} = trpc.project.getMeetingById.useQuery({meetingId},
        {
            refetchInterval: 4000
        })
    
        if(isLoading || !meeting) return <div>Loading...</div>
    
    return(
        <div>
            <div className="p-8">
                <div className="mx-auto flex max-w-2xl items-center gap-x-2 border-b p-2 lg:mx-0 lg:max-w-none">
                    <div className="flex items-center gap-x-6">
                        <div className='rounded-md border bg-white '>
                            <VideoIcon className="h-6 w-6"/>
                        </div>
                        <h1>
                            <div className="text-xs leading-6 text-gray-600 ml-2">
                                Meeting on {''}{meeting.createdAt.slice(0,10)}
                            </div>
                            <div className="mt-1 ml-2  text-sm font-semibold leading-6 text-gray-600">
                                {meeting.name}
                            </div>
                        </h1>
                    </div>


                </div>

            </div>
            <div className='h-4'></div>
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
                {meeting.issues.map((issue) => (
                    <div key={issue.id}>
                        <IssueCard  issue={issue}/>
                    </div>
                    
                ))}
            </div>
        </div>
    )
}

function IssueCard({issue}:{issue: NonNullable<RouterOutputs["project"]["getMeetingById"]>["issues"][number]}){
    const [open,setOpen] = useState(false);
    return(

        <>
            <div className="flex items-center justify-center ">
                <Dialog open={open} onOpenChange={setOpen} >
                <DialogContent className="overflow-y-scroll  overflow-hidden mx-auto bottom-1 flex flex-col gap-4 rounded-md ">
                    <DialogHeader>
                        <DialogTitle className="text-primary font-semibold">
                            {issue.gist}
                        </DialogTitle>
                        <DialogDescription className="text-primary">
                            {issue.createdAt.slice(0,10)}
                        </DialogDescription>

                        <p>{issue.headline}</p>

                        <blockquote className="mt-2 border-l border-primary bg-gray-50 p-4">
                            <span className="text-sm text-gray-600">{issue.start} - {issue.end}</span>
                            <p className="font-medium leading-relaxed text-gray-600 italic">{issue.summary}</p>
                        </blockquote>


                    </DialogHeader>
                </DialogContent>

            </Dialog>

            </div>
            

            <Card className="relative">
            <CardHeader>
                <CardTitle className="text-xl">
                    {issue.gist}
                </CardTitle>
                <div className="border-b">
                </div>

                <CardDescription>
                    {issue.headline}
                </CardDescription>
            </CardHeader>

            <CardContent >
                <Button onClick={()=> setOpen(true)}>
                    Details
                </Button>
            </CardContent>
        </Card>
        
        </>

    )
}