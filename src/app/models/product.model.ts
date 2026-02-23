export type NumericLike = number | string;

export interface Product {
  productSequence: number;
  productId: string;
  companyId: string;
  productName: string;
  rawMaterial: string;
  weight: NumericLike;
  wastage: number;
  norms: NumericLike;
  totalWeight: NumericLike;
  cavity: number;
  shotRate: NumericLike;
  perItemRate: NumericLike;
  salesType: string;
  salesCode: string;
  salesPercent: NumericLike;
  incentiveLimit: number;
  createdAt: string;
  updatedAt: string;
  isActive?: number;
  isDeleted?: number;
  createdBy?: number | null;
  updatedBy?: number | null;
}
