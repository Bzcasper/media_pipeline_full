import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Auth function - replace with your actual auth logic
const auth = (req: Request) => ({ id: "user_" + Date.now() });

export const ourFileRouter: FileRouter = {
  // Audio uploader for music video pipeline
  audioUploader: f({
    audio: {
      maxFileSize: "128MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Audio upload complete for userId:", metadata.userId);
      console.log("File URL:", file.ufsUrl);
      console.log("File key:", file.key);

      return {
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileKey: file.key,
        fileName: file.name,
        fileSize: file.size,
      };
    }),

  // Image uploader for album covers
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Image upload complete for userId:", metadata.userId);

      return {
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileKey: file.key,
      };
    }),

  // Video uploader for direct video uploads
  videoUploader: f({
    video: {
      maxFileSize: "512MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Video upload complete for userId:", metadata.userId);

      return {
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileKey: file.key,
      };
    }),

  // Multi-file uploader for batch processing
  batchUploader: f({
    audio: {
      maxFileSize: "128MB",
      maxFileCount: 10,
    },
  })
    .middleware(async ({ req }) => {
      const user = auth(req);
      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileKey: file.key,
        fileName: file.name,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
