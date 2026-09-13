import { Router } from "express";
import * as templates from "@/controllers/template.controller";
import { requireAdmin, requireAuth } from "@/middleware/auth";

const router = Router();

router.get("/", templates.listTemplates);
router.get("/:id", templates.getTemplate);

router.post("/", requireAuth, requireAdmin, templates.adminCreateTemplate);
router.put("/:id", requireAuth, requireAdmin, templates.adminUpdateTemplate);

export default router;
