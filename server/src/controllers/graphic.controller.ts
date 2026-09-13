import { Response } from "express";
import { prisma } from "@/lib/prisma";
import { asyncHandler } from "@/middleware/errorHandler";
import { AuthedRequest } from "@/middleware/auth";

export const listGraphics = asyncHandler(async (req, res: Response) => {
  const { category } = req.query as { category?: string };
  const graphics = await prisma.graphic.findMany({
    where: category ? { category: category as any } : undefined,
    orderBy: { name: "asc" },
  });
  res.json(graphics);
});

export const adminCreateGraphic = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const graphic = await prisma.graphic.create({ data: req.body });
  res.status(201).json(graphic);
});
