export interface Buyer {
  buyerSequence: number;
  buyerId: string;
  companyId: string;
  buyerName: string;
  buyerAddress: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerGstin?: string;
  createdAt: string | number;
  updatedAt: string | number;
  isActive?: number;
  isDeleted?: number;
  createdBy?: number | null;
  updatedBy?: number | null;
}
