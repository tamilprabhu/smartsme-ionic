import { NumericLike } from './product.model';

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
    price: NumericLike;
    discount: NumericLike;
    totalPrice: NumericLike;
    createdAt: string | number;
    updatedAt: string | number;
    isActive?: number;
    isDeleted?: number;
    createdBy?: number | null;
    updatedBy?: number | null;
}
