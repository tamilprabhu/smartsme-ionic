export interface Company {
  companySequence?: number;
  companyId: string;
  companyName: string;
  businessCons: string;
  companyType: string;
  address: string;
  pincode: number;
  propName: string;
  directPhone: string;
  officePhone: string;
  mgmtPhone?: string;
  mailId: string;
  natureOfBusiness: string;
  authPerson: string;
  mobileNo: string;
  createdAt?: string | number;
  updatedAt?: string | number;
  isActive?: number;
  isDeleted?: number;
  createdBy?: number | null;
  updatedBy?: number | null;
}

export interface CompanyListResponse {
  companies: Company[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
