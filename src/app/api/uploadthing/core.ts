import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { url } from "inspector";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "32MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      return {
        name: file.name,
        key: file.key,
        url: file.url,
      };
    }
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
