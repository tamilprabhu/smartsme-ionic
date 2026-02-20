export interface Invoice {
  invoiceSequence: number;
  invoiceId: string;
  invoiceDate: string;
  compId: string;
  buyrId: string;
  prodId: string;
  quantity: number;
  unitPrice: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  totalAmount: number;
  sacCode: string;
  buyrGstin: string;
  createDate: string;
  updateDate: string;
}
