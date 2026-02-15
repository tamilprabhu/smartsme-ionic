import { ShiftType } from '../enums/shift-type.enum';
import { EntryType } from '../enums/entry-type.enum';
import { ShiftHours } from '../enums/shift-hours.enum';

export interface ProductionShift {
  shiftSequence: number;
  orderId: string;
  companyId: string;
  shiftId: string;
  productId: string;
  machineId: string;
  shiftStartDate: string;
  shiftEndDate: string;
  entryType: string;
  shiftType: string;
  shiftHours?: string;
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
  isActive?: number;
  isDeleted?: number;
  createdBy?: number;
  updatedBy?: number;
  create_date?: string;
  update_date?: string;
}

export interface ProductionShiftFormData {
  orderId: string;
  productId: string;
  machineId: string;
  shiftStartDate: string;
  shiftEndDate: string;
  entryType: EntryType;
  shiftType?: ShiftType;
  shiftHours?: ShiftHours;
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
}
