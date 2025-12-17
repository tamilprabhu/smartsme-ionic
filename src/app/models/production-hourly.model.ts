export interface ProductionHourly {
  orderId: string;
  companyId: string;
  shiftId: string;
  shiftStartTime: string;
  shiftEndTime: string;
  openingCount: number;
  closingCount: number;
  production: number;
}
