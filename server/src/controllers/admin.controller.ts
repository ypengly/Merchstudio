import { Response } from "express";
import { prisma } from "@/lib/prisma";
import { asyncHandler } from "@/middleware/errorHandler";

export const listUsers = asyncHandler(async (req, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true, subscription: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  res.json(users);
});

export const getStats = asyncHandler(async (_req, res: Response) => {
  const [totalUsers, designsCreated, exportsCount, proSubscribers, businessSubscribers] = await Promise.all([
    prisma.user.count(),
    prisma.design.count(),
    prisma.designVersion.count(),
    prisma.subscription.count({ where: { plan: "PRO" } }),
    prisma.subscription.count({ where: { plan: "BUSINESS" } }),
  ]);
  res.json({ totalUsers, designsCreated, exportsCount, proSubscribers, businessSubscribers });
});

// Unfiltered catalog listings for the admin UI — the public endpoints only return
// enabled items, so disabling something here would otherwise make it disappear.
export const adminListProducts = asyncHandler(async (_req, res: Response) => {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { name: "asc" },
  });
  res.json(products);
});

export const adminListTemplates = asyncHandler(async (_req, res: Response) => {
  const templates = await prisma.template.findMany({ orderBy: { createdAt: "desc" } });
  res.json(templates);
});

export const adminListGraphics = asyncHandler(async (_req, res: Response) => {
  const graphics = await prisma.graphic.findMany({ orderBy: { name: "asc" } });
  res.json(graphics);
});
