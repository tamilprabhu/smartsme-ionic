export interface Seller {
  sellerSequence: number;
  sellerId: string;
  companyId: string;
  sellerName: string;
  sellerAddress: string;
  sellerPhone: string;
  sellerEmail: string;
  createdAt: string | number;
  updatedAt: string | number;
  isActive?: number;
  isDeleted?: number;
  createdBy?: number | null;
  updatedBy?: number | null;
}
