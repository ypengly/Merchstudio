import { Router } from "express";
import * as graphics from "@/controllers/graphic.controller";
import { requireAdmin, requireAuth } from "@/middleware/auth";

const router = Router();

router.get("/", graphics.listGraphics);
router.post("/", requireAuth, requireAdmin, graphics.adminCreateGraphic);

export default router;
