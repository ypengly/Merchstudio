import { Response } from "express";
import { prisma } from "@/lib/prisma";
import { asyncHandler, ApiError } from "@/middleware/errorHandler";
import { AuthedRequest } from "@/middleware/auth";

export const listProducts = asyncHandler(async (_req, res: Response) => {
  const products = await prisma.product.findMany({
    where: { isEnabled: true },
    include: { variants: { where: { isEnabled: true } } },
    orderBy: { name: "asc" },
  });
  res.json(products);
});

export const getProduct = asyncHandler(async (req, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { variants: true },
  });
  if (!product) throw new ApiError(404, "Product not found");
  res.json(product);
});

// ---- Admin ----

export const adminCreateProduct = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const product = await prisma.product.create({ data: req.body });
  res.status(201).json(product);
});

export const adminUpdateProduct = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const product = await prisma.product.update({ where: { id: req.params.id }, data: req.body });
  res.json(product);
});

export const adminAddVariant = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const variant = await prisma.productVariant.create({
    data: { ...req.body, productId: req.params.id },
  });
  res.status(201).json(variant);
});
