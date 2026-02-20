export interface Employee {
  employeeSequence: number;
  employeeId: string;
  userId: number;
  companyId: string;
  salary: number;
  activeFlag: string;
  createdAt: string | number;
  updatedAt: string | number;
  isActive?: number;
  isDeleted?: number;
  createdBy?: number | null;
  updatedBy?: number | null;
}
