export interface Dispatch {
  dispatchSequence: number;
  productId: string;
  companyId: string;
  orderId: string;
  dispatchId: string;
  dispatchDate: string;
  quantity: number;
  noOfPacks: number;
  totalWeight: number;
  normalWeight: number;
  normsWeight: number;
  createdAt: string | number;
  updatedAt: string | number;
  isActive?: number;
  isDeleted?: number;
  createdBy?: number | null;
  updatedBy?: number | null;
}
