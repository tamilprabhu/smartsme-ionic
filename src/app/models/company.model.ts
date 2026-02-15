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
  createDate?: string;
  updateDate?: string;
}

export interface CompanyListResponse {
  companies: Company[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}