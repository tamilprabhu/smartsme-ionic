export interface Product {
  prodSequence: number;
  productId: string;
  companyId: string;
  productName: string;
  rawMaterial: string;
  weight: string;
  wastage: number;
  norms: string;
  totalWeight: string;
  cavity: number;
  shotRate: string;
  perItemRate: string;
  salesType?: string;
  salesCode?: string;
  salesPercent?: string;
  incentiveLimit: number;
  isActive?: number;
  isDeleted?: number;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdAt: number;
  updatedAt: number;
}
