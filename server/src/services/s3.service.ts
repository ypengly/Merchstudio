import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { env } from "@/config/env";

const s3 = new S3Client({
  endpoint: env.s3.endpoint || undefined,
  region: env.s3.region,
  forcePathStyle: env.s3.forcePathStyle,
  credentials: {
    accessKeyId: env.s3.accessKeyId,
    secretAccessKey: env.s3.secretAccessKey,
  },
});

const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);

export function isAllowedUploadMime(mime: string): boolean {
  return ALLOWED_MIME_TYPES.has(mime);
}

export async function uploadBuffer(params: {
  buffer: Buffer;
  mimeType: string;
  originalName: string;
  userId: string;
}): Promise<{ url: string; key: string }> {
  const ext = params.originalName.split(".").pop() ?? "bin";
  const key = `uploads/${params.userId}/${randomUUID()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: env.s3.bucket,
      Key: key,
      Body: params.buffer,
      ContentType: params.mimeType,
      ACL: "public-read",
    })
  );

  const url = env.s3.publicUrl ? `${env.s3.publicUrl}/${key}` : `${env.s3.endpoint}/${env.s3.bucket}/${key}`;
  return { url, key };
}
