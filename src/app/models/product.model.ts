export interface Product {
  productId: string;
  productName: string;
  rawMaterial: string;
  weight: number;         // Float
  wastage: number;        // Int
  norms: number;          // Float
  totalWeight: number;    // Float (Weight x Wastage / 100)
  cavity: number;         // Int
  shotRate: number;       // Float (single time production shot rate)
  rate: number;           // Float (Price per item)
  incentiveLimit: number; // Int
  productionShotQty: number; // Int (Quantity of shots)
  perHourProdQty: number; // Number per hour productivity
}
