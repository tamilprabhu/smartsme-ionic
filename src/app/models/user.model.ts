export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  password?: string;
  createdAt: string | number;
  updatedAt: string | number;
  isActive?: number;
  isDeleted?: number;
  createdBy?: number | null;
  updatedBy?: number | null;
}
