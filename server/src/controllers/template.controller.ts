import { Response } from "express";
import { prisma } from "@/lib/prisma";
import { asyncHandler, ApiError } from "@/middleware/errorHandler";
import { AuthedRequest } from "@/middleware/auth";

export const listTemplates = asyncHandler(async (req, res: Response) => {
  const { category } = req.query as { category?: string };
  const templates = await prisma.template.findMany({
    where: {
      isEnabled: true,
      ...(category ? { category: category as any } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(templates);
});

export const getTemplate = asyncHandler(async (req, res: Response) => {
  const template = await prisma.template.findUnique({ where: { id: req.params.id } });
  if (!template) throw new ApiError(404, "Template not found");
  res.json(template);
});

// ---- Admin ----

export const adminCreateTemplate = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const template = await prisma.template.create({ data: req.body });
  res.status(201).json(template);
});

export const adminUpdateTemplate = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const template = await prisma.template.update({ where: { id: req.params.id }, data: req.body });
  res.json(template);
});
