export interface Invoice {
  invoiceSequence: number;
  invoiceId: string;
  invoiceDate: string;
  companyId: string;
  buyerId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  totalAmount: number;
  sacCode: string;
  buyrGstin: string;
  createdAt: string | number;
  updatedAt: string | number;
  isActive?: number;
  isDeleted?: number;
  createdBy?: number | null;
  updatedBy?: number | null;
}
