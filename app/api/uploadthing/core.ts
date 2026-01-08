import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";


const f = createUploadthing();


export const ourFileRouter = {
  audioUploader: f({
    audio:{
      maxFileSize: "16MB",
      maxFileCount: 1,
    }
  })
  .middleware(async ({req}) => {
    console.log("[UT] middleware invoked for audioUploader");
    const user = await currentUser();
    if(!user) {
      console.warn("[UT] Unauthorized upload attempt");
      throw new Error('Unauthorized');
    }
    console.log("[UT] Authenticated user:", user.id);
    return { userId: user.id };
  })
    .onUploadComplete(async ({metadata, file }) => {
      console.log("Upload complete - Metadata:", metadata);
      console.log("Upload complete - File:", file);

      return { 
        userId: metadata.userId, 
        fileUrl: file.url,
        fileUfsUrl:file.ufsUrl,
        fileName: file.name 
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
