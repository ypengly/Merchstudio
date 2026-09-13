export type Role = "USER" | "ADMIN";
export type PlanTier = "FREE" | "PRO" | "BUSINESS";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  plan?: PlanTier;
}

export type ProductCategory = "TSHIRT" | "HOODIE" | "SWEATSHIRT" | "TOTE_BAG" | "CAP" | "MUG";

export interface ProductVariant {
  id: string;
  productId: string;
  colorName: string;
  colorHex: string;
  frontImage: string;
  backImage?: string | null;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  designAreaWidth: number;
  designAreaHeight: number;
  variants: ProductVariant[];
}

export type ElementType = "TEXT" | "IMAGE" | "SHAPE" | "GRAPHIC";

export interface DesignElement {
  id: string;
  type: ElementType;
  name: string;
  zIndex: number;
  isLocked: boolean;
  isHidden: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  props: Record<string, any>;
}

export interface Design {
  id: string;
  name: string;
  productId: string;
  variantId?: string | null;
  product?: Product;
  variant?: ProductVariant;
  isFavorite: boolean;
  thumbnailUrl?: string | null;
  elements: DesignElement[];
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  previewUrl: string;
  isPremium: boolean;
  isEnabled?: boolean;
}

export interface Graphic {
  id: string;
  name: string;
  category: string;
  assetUrl: string;
  isPremium: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  createdAt: string;
  subscription?: { plan: PlanTier; status: string } | null;
}

export interface AdminStats {
  totalUsers: number;
  designsCreated: number;
  exportsCount: number;
  proSubscribers: number;
  businessSubscribers: number;
}
