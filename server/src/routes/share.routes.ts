import { Router } from "express";
import * as share from "@/controllers/share.controller";

const router = Router();

router.get("/:token", share.getSharedDesign);

export default router;
