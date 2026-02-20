export interface Order {
  orderSequence: number;
  orderId: string;
  orderName: string;
  companyId: string;
  productId: string;
  buyerId: string;
  orderStatus: string;
  orderDate: string;
  targetDate: string;
  orderQuantity: number;
  price: number;
  discount: number;
  totalPrice: number;
  createdAt: string | number;
  updatedAt: string | number;
  isActive?: number;
  isDeleted?: number;
  createdBy?: number | null;
  updatedBy?: number | null;
}
