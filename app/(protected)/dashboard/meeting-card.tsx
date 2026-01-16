"use client";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Presentation, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import useProject from "@/hooks/use-project";
import { useRouter } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function MeetingCard() {

  const router = useRouter();
  const {project} = useProject();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName,setFileName] =useState("Unknown");
  const uploadMeeting = trpc.project.uploadMeeting.useMutation();

  const processMeeting = useMutation({
          mutationFn: async (data :{meetingUrl: string, meetingId: string, projectId: string}) => {
              const {meetingUrl, meetingId, projectId} = data;
              const response = await axios.post('/api/process-meeting',{
                  meetingUrl,
                  meetingId,
                  projectId
              })
              return response.data;
          }
      });

  const { startUpload } = useUploadThing("audioUploader", {
    onClientUploadComplete: () => {
      toast.success("Upload complete!");
      setIsUploading(false);
    },
    onUploadProgress: (p) => {
      setProgress(p);
      toast.info(`Upload progress ${p}%`);
    },
    onUploadError: (err) => {
      toast.error(`Upload failed: ${err.message}`);
      setIsUploading(false);
      setProgress(0);
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "audio/*": [".wav", ".mp3", ".m4a"],
    },
    multiple: false,
    maxSize: 16 * 1024 * 1024,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      setProgress(0);

      const upload = await startUpload([file]);
        const uploadedFile = upload?.[0];
        const uploadFileUrl =
          uploadedFile?.ufsUrl ||
          uploadedFile?.url ||
          uploadedFile?.serverData?.fileUfsUrl ||
          uploadedFile?.serverData?.fileUrl;
        const fileName = uploadedFile?.name || uploadedFile?.serverData?.fileName || 'unknown';
        setFileName(fileName);
        if (uploadFileUrl) {
          setFileUrl(uploadFileUrl);
          setIsUploading(false);
          uploadMeeting.mutate({
          projectId: project?.id || '',
          meetingUrl: uploadFileUrl ,
          name: fileName
        },{
          onSuccess: (meeting) => {
            toast.success("Meeting uploaded successfullt!");
            router.push('/meetings');
            processMeeting.mutateAsync({
              meetingUrl: uploadFileUrl,
              meetingId: meeting.id || '',
              projectId: project?.id || '',
            })

          },
          onError: () => {
            toast.error(`Failed to uploade meeting`);
          }
         }
      )
        } else {
          toast.warning("Upload succeeded but no URL found");
          setIsUploading(false);
      }

    },
  });

  return (
    <Card
      className="w-full flex flex-col items-center justify-center rounded-md p-4 bg-white border shadow-md"
      {...getRootProps()}
    >
      {!isUploading && (
        <>
          <Presentation className="h-10 w-10 animate-bounce mt-4" />
          <div className="flex flex-col items-center justify-center">
            <h3 className="mt-2 text-md font-semibold text-gray-900">
              Create a new meeting
            </h3>
            <p className="mt-1 text-center text-xs  text-gray-500">
              Analyse your meeting with Gitview
            </p>

            <p className="text-xs text-gray-400">Powered by AI</p>
          </div>

          <div className="mt-4">
            <Button disabled={isUploading}>
              <Upload className="-ml-0.5 mr-1.5 h-5 w-5 " aria-hidden="true" />
              Upload Meeting
              <input className="hidden" {...getInputProps()} />
            </Button>
          </div>
        </>
      )}

      {isUploading && (
        <div className="flex  flex-col items-center justify-center gap-4">
          <CircularProgressbar value={progress} text={`${progress}%`} className="size-20 text-center"
              styles={buildStyles({
                pathColor: "#8B5CF6",
                textColor: "#8B5CF6",
              })}
          />
          <p className="text-xs text-gray-500">Uploading your meeting...</p>
          <p>{fileUrl}</p>
        </div>
      )}
    </Card>
  );
}
