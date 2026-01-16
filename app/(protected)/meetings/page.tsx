"use client";

import { trpc } from "@/app/_trpc/client";
import useProject from "@/hooks/use-project";
import MeetingCard from "../dashboard/meeting-card";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


export default function MeetingsPage() {
  const { projectId } = useProject();
  const refetch = useRefetch();
  const { data: meetings, isLoading } = trpc.project.getMeetings.useQuery(
    { projectId },
    {
      refetchInterval: 4000,
    }
  );

  const deleteMeeting = trpc.project.deleteMeeting.useMutation();
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="">
        <MeetingCard />
      </div>

      <div className="h-6"></div>

      <h1 className="text-xl font-semibold mb-4 mt-4">Meetings</h1>
      {meetings && meetings.length === 0 && <div>No meetings found</div>}
      {isLoading && <div>Loading meetings...</div>}

      <ul className="divide-y divide-gray-200">
        {meetings?.map((meeting) => (
          <div key={meeting.id}>
            <Dialog open={open} onOpenChange={setOpen}>
              <div className="flex items-center justify-center">
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this project?
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex justify-end gap-3">
                    <Button disabled={deleteMeeting.isPending}
                      variant={"destructive"}
                      onClick={() => {
                        deleteMeeting.mutate(
                          { meetingId: meeting.id },
                          {
                            onSuccess: () => {
                              toast.success("Meeting deleted successfully");
                              refetch();
                              setOpen(false);
                            },
                            onError: (error) => {
                                toast.error("Failed to delete meeting");
                                console.error("Failed to delete meeting"+error.message);
                                console.log('Meeting Id: ',meeting.id);
                                setOpen(false);
                            }
                          }
                        )}
                      }
                    >
                      Confirm
                    </Button>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </div>
            </Dialog>

            <li
              key={meeting.id}
              className="flex items-center justify-between py-2 border shadow-md rounded-md bg-white mb-4 p-4 gap-x-6"
            >
              <div className="">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/meetings/${meeting.id}`}
                      className="text-sm font-semibold py-2"
                    >
                      {meeting.name}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center text-xs text-gray-500 gap-x-2">
                  <p className="whitespace-nowrap  border px-2 py-1 rounded-md shadow-sm text-black">
                    {new Date(meeting.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "medium",
                    })}
                  </p>
                  <p className="truncate ml-2 border px-2 py-1 rounded-md shadow-xs bg-yellow-300 text-black font-semibold">
                    {meeting.issues.length} issues
                  </p>
                  {meeting.status === "PROCESSING" && (
                    <div className="flex items-center gap-2">
                      <Button size={"sm"} className="px-2 py-1 ml-2">
                        <Loader2 className="animate-spin w-3 h-3" />
                        <p className="text-xs">Processing...</p>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center flex-none gap-x-4">
                <Link href={`/meetings/${meeting.id}`}>
                  <Button variant="outline">View Meeting</Button>
                </Link>
                <Button
                  disabled={deleteMeeting.isPending}
                  variant={"destructive"}
                  className="ml-2"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}
