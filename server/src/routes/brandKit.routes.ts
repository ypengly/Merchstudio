import { Router } from "express";
import * as brandKit from "@/controllers/brandKit.controller";
import { requireAuth } from "@/middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", brandKit.getBrandKit);
router.put("/", brandKit.upsertBrandKit);

export default router;
