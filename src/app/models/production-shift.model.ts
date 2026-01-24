export interface ProductionShift {
  shiftIdSeq: number;
  orderId: string;
  companyId: string;
  shiftId: string;
  prodName: string;
  machineId: string;
  shiftStartDate: string;
  shiftEndDate: string;
  shiftStartTime: string;
  shiftEndTime: string;
  workType: string;
  entryType: string;
  shiftType: string;
  operator1: number;
  operator2?: number;
  operator3?: number;
  supervisor: number;
  openingCount: number;
  closingCount: number;
  production: number;
  rejection: number;
  netProduction: number;
  incentive: string;
  less80Reason?: string;
  createDate?: string;
  updateDate?: string;
}

export interface ProductionEntry {
    machine: string;
    workType: string;
    shiftType?: string;
    shiftHours?: string;
    operator1: string;
    operator2?: string;
    operator3?: string;
    supervisor: string;
    shiftDate: string;
    shiftStartTime: string;
  }
