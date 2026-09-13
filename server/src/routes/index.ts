import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import productRoutes from "@/routes/product.routes";
import templateRoutes from "@/routes/template.routes";
import graphicRoutes from "@/routes/graphic.routes";
import designRoutes from "@/routes/design.routes";
import uploadRoutes from "@/routes/upload.routes";
import brandKitRoutes from "@/routes/brandKit.routes";
import shareRoutes from "@/routes/share.routes";
import adminRoutes from "@/routes/admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/templates", templateRoutes);
router.use("/graphics", graphicRoutes);
router.use("/designs", designRoutes);
router.use("/uploads", uploadRoutes);
router.use("/brand-kit", brandKitRoutes);
router.use("/shared", shareRoutes);
router.use("/admin", adminRoutes);

export default router;
