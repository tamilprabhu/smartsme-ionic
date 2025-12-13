// src/app/models/buyer.model.ts

export interface Buyer {
  buyerId: string;
  buyerName: string;
  address: string;
  phone: string;
  email: string;
  gstin?: string;
}
