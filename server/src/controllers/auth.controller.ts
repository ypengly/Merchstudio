import { Response } from "express";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/utils/jwt";
import { loginSchema, registerSchema } from "@/validators/auth.validator";
import { ApiError, asyncHandler } from "@/middleware/errorHandler";
import { AuthedRequest } from "@/middleware/auth";

function issueTokens(user: { id: string; role: "USER" | "ADMIN" }) {
  return {
    accessToken: signAccessToken({ sub: user.id, role: user.role }),
    refreshToken: signRefreshToken({ sub: user.id }),
  };
}

export const register = asyncHandler(async (req, res: Response) => {
  const data = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      subscription: { create: { plan: "FREE" } },
    },
  });

  const tokens = issueTokens(user);
  res.status(201).json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    ...tokens,
  });
});

export const login = asyncHandler(async (req, res: Response) => {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new ApiError(401, "Invalid email or password");

  const valid = await verifyPassword(data.password, user.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid email or password");

  const tokens = issueTokens(user);
  res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    ...tokens,
  });
});

export const refresh = asyncHandler(async (req, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) throw new ApiError(400, "refreshToken is required");

  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw new ApiError(401, "Invalid refresh token");

  res.json(issueTokens(user));
});

export const logout = asyncHandler(async (_req, res: Response) => {
  // Stateless JWTs: logout is handled client-side by discarding tokens.
  // A refresh-token denylist (e.g. in Redis) is the natural next step for real revocation.
  res.status(204).send();
});

export const me = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { subscription: true },
  });
  if (!user) throw new ApiError(404, "User not found");
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    plan: user.subscription?.plan ?? "FREE",
  });
});
