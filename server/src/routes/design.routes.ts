import { Router } from "express";
import * as designs from "@/controllers/design.controller";
import { requireAuth } from "@/middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", designs.listDesigns);
router.post("/", designs.createDesign);
router.get("/:id", designs.getDesign);
router.put("/:id", designs.updateDesign);
router.delete("/:id", designs.deleteDesign);
router.post("/:id/duplicate", designs.duplicateDesign);
router.post("/:id/share", designs.shareDesign);

export default router;
