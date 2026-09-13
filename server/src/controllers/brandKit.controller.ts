import { Response } from "express";
import { prisma } from "@/lib/prisma";
import { asyncHandler } from "@/middleware/errorHandler";
import { AuthedRequest } from "@/middleware/auth";
import { brandKitSchema } from "@/validators/design.validator";

export const getBrandKit = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const kit = await prisma.brandKit.findUnique({ where: { userId: req.user!.id } });
  res.json(kit ?? null);
});

export const upsertBrandKit = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const data = brandKitSchema.parse(req.body);
  const kit = await prisma.brandKit.upsert({
    where: { userId: req.user!.id },
    update: data,
    create: { ...data, userId: req.user!.id },
  });
  res.json(kit);
});
