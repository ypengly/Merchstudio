import { z } from "zod";

export const createDesignSchema = z.object({
  name: z.string().min(1).max(120).default("Untitled design"),
  productId: z.string().min(1),
  variantId: z.string().min(1).optional(),
  templateId: z.string().min(1).optional(),
});

export const updateDesignSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  variantId: z.string().min(1).optional(),
  isFavorite: z.boolean().optional(),
  elements: z
    .array(
      z.object({
        id: z.string().optional(),
        type: z.enum(["TEXT", "IMAGE", "SHAPE", "GRAPHIC"]),
        name: z.string().default("Layer"),
        zIndex: z.number().default(0),
        isLocked: z.boolean().default(false),
        isHidden: z.boolean().default(false),
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
        rotation: z.number().default(0),
        opacity: z.number().min(0).max(1).default(1),
        props: z.record(z.any()),
      })
    )
    .optional(),
});

export const brandKitSchema = z.object({
  logoUrl: z.string().url().optional().nullable(),
  primaryColor: z.string().max(20).optional().nullable(),
  secondaryColor: z.string().max(20).optional().nullable(),
  fontFamily: z.string().max(80).optional().nullable(),
});
