export interface Stock {
  stockSequence: number;
  companyId: string;
  sellerId: string;
  stockId: string;
  stockDate: string;
  rawMaterial: string;
  noOfBars: number;
  weight: number;
  inwardType: string;
  rate: number;
  createdAt: string | number;
  updatedAt: string | number;
  isActive?: number;
  isDeleted?: number;
  createdBy?: number | null;
  updatedBy?: number | null;
}
