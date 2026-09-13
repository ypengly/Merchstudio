import { Router } from "express";
import * as products from "@/controllers/product.controller";
import { requireAdmin, requireAuth } from "@/middleware/auth";

const router = Router();

router.get("/", products.listProducts);
router.get("/:id", products.getProduct);

router.post("/", requireAuth, requireAdmin, products.adminCreateProduct);
router.put("/:id", requireAuth, requireAdmin, products.adminUpdateProduct);
router.post("/:id/variants", requireAuth, requireAdmin, products.adminAddVariant);

export default router;
