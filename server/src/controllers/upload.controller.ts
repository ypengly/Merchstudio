import { Response } from "express";
import { prisma } from "@/lib/prisma";
import { asyncHandler, ApiError } from "@/middleware/errorHandler";
import { AuthedRequest } from "@/middleware/auth";
import { isAllowedUploadMime, uploadBuffer } from "@/services/s3.service";

export const createUpload = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) throw new ApiError(400, "No file provided");
  if (!isAllowedUploadMime(file.mimetype)) {
    throw new ApiError(415, "Unsupported file type. Allowed: PNG, JPG, WEBP, SVG.");
  }

  const { url } = await uploadBuffer({
    buffer: file.buffer,
    mimeType: file.mimetype,
    originalName: file.originalname,
    userId: req.user!.id,
  });

  const upload = await prisma.upload.create({
    data: {
      userId: req.user!.id,
      url,
      fileName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    },
  });
  res.status(201).json(upload);
});

export const listUploads = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const uploads = await prisma.upload.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(uploads);
});
