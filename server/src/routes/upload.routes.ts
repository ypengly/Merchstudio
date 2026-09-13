import { Router } from "express";
import multer from "multer";
import * as uploads from "@/controllers/upload.controller";
import { requireAuth } from "@/middleware/auth";
import { env } from "@/config/env";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadSizeMb * 1024 * 1024 },
});

const router = Router();

router.use(requireAuth);
router.get("/", uploads.listUploads);
router.post("/", upload.single("file"), uploads.createUpload);

export default router;
