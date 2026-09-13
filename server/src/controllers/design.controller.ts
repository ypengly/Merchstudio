import { Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { asyncHandler, ApiError } from "@/middleware/errorHandler";
import { AuthedRequest } from "@/middleware/auth";
import { createDesignSchema, updateDesignSchema } from "@/validators/design.validator";

const FREE_DESIGN_LIMIT = 3;

export const listDesigns = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { search, productId, sort } = req.query as { search?: string; productId?: string; sort?: string };

  const designs = await prisma.design.findMany({
    where: {
      userId: req.user!.id,
      ...(productId ? { productId } : {}),
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
    include: { product: true, variant: true },
    orderBy: sort === "name" ? { name: "asc" } : { updatedAt: "desc" },
  });
  res.json(designs);
});

export const getDesign = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const design = await prisma.design.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
    include: { product: true, variant: true, elements: { orderBy: { zIndex: "asc" } } },
  });
  if (!design) throw new ApiError(404, "Design not found");
  res.json(design);
});

export const createDesign = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const data = createDesignSchema.parse(req.body);

  const [subscription, designCount] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId: req.user!.id } }),
    prisma.design.count({ where: { userId: req.user!.id } }),
  ]);
  if ((subscription?.plan ?? "FREE") === "FREE" && designCount >= FREE_DESIGN_LIMIT) {
    throw new ApiError(403, `Free plan is limited to ${FREE_DESIGN_LIMIT} designs. Upgrade to Pro for unlimited designs.`);
  }

  let elementsToCreate: any[] = [];
  if (data.templateId) {
    const template = await prisma.template.findUnique({ where: { id: data.templateId } });
    if (!template) throw new ApiError(404, "Template not found");
    const snapshot = template.snapshot as { elements?: any[] } | null;
    elementsToCreate = snapshot?.elements ?? [];
  }

  const design = await prisma.design.create({
    data: {
      userId: req.user!.id,
      productId: data.productId,
      variantId: data.variantId,
      name: data.name,
      elements: elementsToCreate.length
        ? { create: elementsToCreate.map((el) => ({ ...el, id: undefined })) }
        : undefined,
    },
    include: { elements: true },
  });
  res.status(201).json(design);
});

export const updateDesign = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const data = updateDesignSchema.parse(req.body);
  const existing = await prisma.design.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!existing) throw new ApiError(404, "Design not found");

  const design = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (data.elements) {
      await tx.designElement.deleteMany({ where: { designId: existing.id } });
      await tx.designElement.createMany({
        data: data.elements.map((el) => ({ ...el, id: undefined, designId: existing.id })),
      });
      await tx.designVersion.create({
        data: { designId: existing.id, snapshot: { elements: data.elements } },
      });
    }
    return tx.design.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        variantId: data.variantId,
        isFavorite: data.isFavorite,
      },
      include: { elements: { orderBy: { zIndex: "asc" } } },
    });
  });

  res.json(design);
});

export const deleteDesign = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const existing = await prisma.design.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!existing) throw new ApiError(404, "Design not found");
  await prisma.design.delete({ where: { id: existing.id } });
  res.status(204).send();
});

// Clone a design as a variation (e.g. different color or product) linked back to its parent.
export const duplicateDesign = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const source = await prisma.design.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
    include: { elements: true },
  });
  if (!source) throw new ApiError(404, "Design not found");

  const { name, variantId } = req.body as { name?: string; variantId?: string };

  const copy = await prisma.design.create({
    data: {
      userId: req.user!.id,
      productId: source.productId,
      variantId: variantId ?? source.variantId,
      name: name ?? `${source.name} copy`,
      parentDesignId: source.id,
      elements: {
        create: source.elements.map((el: (typeof source.elements)[number]) => ({
          type: el.type,
          name: el.name,
          zIndex: el.zIndex,
          isLocked: el.isLocked,
          isHidden: el.isHidden,
          x: el.x,
          y: el.y,
          width: el.width,
          height: el.height,
          rotation: el.rotation,
          opacity: el.opacity,
          props: el.props as any,
        })),
      },
    },
    include: { elements: true },
  });
  res.status(201).json(copy);
});

export const shareDesign = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const existing = await prisma.design.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!existing) throw new ApiError(404, "Design not found");

  const shared = await prisma.sharedDesign.upsert({
    where: { designId: existing.id },
    update: { isActive: true },
    create: { designId: existing.id },
  });
  res.json({ token: shared.token, url: `/shared/${shared.token}` });
});
