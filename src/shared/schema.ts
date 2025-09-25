import { string, z } from "zod";

// User types
export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  balance: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tool types
export interface Tool {
  id: string;
  name: string;
  description: string;
  price: string;
  prices?: any; // Array of pricing options with duration and amount
  purchases: number; // Total number of purchases
  categoryId?: string;
  imageUrl?: string;
  videoUrl?: string;
  instructions?: string; // Markdown content
  downloadUrl?: string;
  views: number;
  rating: string;
  reviewCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

// Purchase types
export interface Purchase {
  id: string;
  userId: string;
  toolId: string;
  price: string;
  discountAmount: string;
  finalPrice: string;
  discountCodeId?: string;
  expiresAt: Date;
  keyValue: string;
  isActive: boolean;
  createdAt: Date;
}

// Discount code types
export interface DiscountCode {
  id: string;
  code: string;
  discountType: string; // 'percentage' or 'fixed'
  discountValue: string;
  minPurchaseAmount: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

// Payment types
export interface Payment {
  id: string;
  userId: string;
  amount: string;
  type: string; // 'deposit' or 'purchase'
  status: string; // 'pending', 'completed', 'failed'
  description?: string;
  transactionId?: string;
  createdAt: Date;
}

// Key validation types
export interface KeyValidation {
  id: string;
  keyValue: string;
  userId?: string;
  toolId?: string;
  isValid: boolean;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Insert schemas for validation
export const insertUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().optional(),
  balance: z.string().default("0"),
  isAdmin: z.boolean().default(false),
});

export const insertToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.string(),
  prices: z.any().optional(),
  purchases: z.number().default(0),
  categoryId: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  instructions: z.string().optional(),
  downloadUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const insertCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
});

export const insertPurchaseSchema = z.object({
  userId: z.string(),
  toolId: z.string(),
  price: z.string(),
  discountAmount: z.string().default("0"),
  finalPrice: z.string(),
  discountCodeId: z.string().optional(),
  expiresAt: z.date(),
  isActive: z.boolean().default(true),
});

export const insertDiscountCodeSchema = z.object({
  code: z.string(),
  discountType: z.string(),
  discountValue: z.string(),
  minPurchaseAmount: z.string().default("0"),
  usageLimit: z.number().optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.date().optional(),
});

export const insertPaymentSchema = z.object({
  userId: z.string(),
  amount: z.string(),
  type: z.string(),
  status: z.string().default("completed"),
  description: z.string().optional(),
  transactionId: z.string().optional(),
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type InsertTool = z.infer<typeof insertToolSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type InsertDiscountCode = z.infer<typeof insertDiscountCodeSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
