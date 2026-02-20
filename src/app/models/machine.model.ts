export interface Machine {
  machineSequence: number;
  machineId: string;
  companyId: string;
  machineName: string;
  machineType: string;
  capacity: string;
  model: string;
  activeFlag: string;
  createdAt: string | number;
  updatedAt: string | number;
  isActive?: number;
  isDeleted?: number;
  createdBy?: number | null;
  updatedBy?: number | null;
}
