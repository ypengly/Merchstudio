import { Response } from "express";
import { prisma } from "@/lib/prisma";
import { asyncHandler, ApiError } from "@/middleware/errorHandler";

// Public, read-only view of a shared design. No auth — token is the capability.
export const getSharedDesign = asyncHandler(async (req, res: Response) => {
  const shared = await prisma.sharedDesign.findUnique({
    where: { token: req.params.token },
    include: {
      design: {
        include: { product: true, variant: true, elements: { orderBy: { zIndex: "asc" } } },
      },
    },
  });
  if (!shared || !shared.isActive) throw new ApiError(404, "This shared design is unavailable");

  res.json({
    name: shared.design.name,
    product: shared.design.product,
    variant: shared.design.variant,
    elements: shared.design.elements,
  });
});
