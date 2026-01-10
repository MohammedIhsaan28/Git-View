'use client';

import { trpc } from "@/app/_trpc/client";
import useProject from "@/hooks/use-project";
import MeetingCard from "../dashboard/meeting-card";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";

export default function MeetingsPage() {
    const {projectId} = useProject();
    const refetch = useRefetch();
    const {data: meetings,isLoading} = trpc.project.getMeetings.useQuery({projectId},{
        refetchInterval:4000
    });

    const deleteMeeting = trpc.project.deleteMeeting.useMutation();

    return (
        <>
        <div className="">
            <MeetingCard/>
        </div>
            
            <div className="h-6"></div>

            <h1 className="text-xl font-semibold mb-4 mt-4">Meetings</h1>
            {meetings && meetings.length === 0 && (<div>No meetings found</div>)}
            {isLoading && (
                <div>
                    Loading meetings...
                </div>
            )}

            <ul className="divide-y divide-gray-200">
                {meetings?.map((meeting) => (
                    <li key={meeting.id} className="flex items-center justify-between py-2 border shadow-md rounded-md bg-white mb-4 p-4 gap-x-6">
                        <div className="">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">

                                    <Link href={`/meetings/${meeting.id}`} className="text-sm font-semibold py-2">
                                        {meeting.name}
                                    </Link>

                                    

                                </div>

                            </div>

                            <div className="flex items-center text-xs text-gray-500 gap-x-2">
                                <p className="whitespace-nowrap  border px-2 py-1 rounded-md shadow-sm text-black">{new Date(meeting.createdAt).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'medium'})}</p>
                                <p className="truncate ml-2 border px-2 py-1 rounded-md shadow-xs bg-yellow-300 text-black font-semibold">{meeting.issues.length} issues</p>
                                {meeting.status === 'PROCESSING' && (
                                        <div className="flex items-center gap-2 bg-yellow-400">
                                            <Button size={'sm'} className="px-2 py-1 ml-2" >
                                                 <Loader2 className="animate-spin w-3 h-3"/>
                                                <p className="text-xs">Processing...</p>
                                                
                                            </Button>
                                           
                                        </div>
                                        
                                     
                                    )}
                            </div>

                        </div>

                        <div className="flex items-center flex-none gap-x-4">
                            <Link href={`/meetings/${meeting.id}`}>
                                    <Button variant="outline" >
                                        View Meeting
                                    </Button>
                            </Link>
                            <Button disabled={deleteMeeting.isPending} variant={'destructive'} className="ml-2" onClick={()=> deleteMeeting.mutate({meetingId: meeting.id},
                                {
                                    onSuccess:() => {
                                        toast.success("Meeting deleted successfully");
                                        refetch();

                                    }
                                }
                            )}>
                                Delete
                            </Button>

                        </div>


                    </li>
                ))}

            </ul>
        
        </>
    )
}