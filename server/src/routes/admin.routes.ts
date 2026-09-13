import { Router } from "express";
import * as admin from "@/controllers/admin.controller";
import { requireAdmin, requireAuth } from "@/middleware/auth";

const router = Router();

router.use(requireAuth, requireAdmin);
router.get("/users", admin.listUsers);
router.get("/stats", admin.getStats);
router.get("/products", admin.adminListProducts);
router.get("/templates", admin.adminListTemplates);
router.get("/graphics", admin.adminListGraphics);

export default router;
