import { NextFunction, Request, Response } from "express";
import { ApiError } from "@/middleware/errorHandler";
import { verifyAccessToken } from "@/utils/jwt";

export interface AuthedRequest extends Request {
  user?: { id: string; role: "USER" | "ADMIN" };
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing or invalid Authorization header"));
  }
  try {
    const payload = verifyAccessToken(header.slice("Bearer ".length));
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    return next(new ApiError(403, "Admin access required"));
  }
  next();
}
