export interface Order {
  orderSequence: number;
  orderId: string;
  orderName: string;
  companyId: string;
  prodId: string;
  buyerId: string;
  orderStatus: string;
  orderDate: string;
  targetDate: string;
  orderQuantity: number;
  price: number;
  discount: number;
  totalPrice: number;
  createDate: string;
  updateDate: string;
}
