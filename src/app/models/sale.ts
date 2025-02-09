import { Payment } from "./payment";
import { SaleItem } from "./sale-item";

export interface Sale {
  id?:number;
  customerId?: number;
  total: number;
  createdAt?: Date;
  saleItems: SaleItem[];
  payment?: Payment;
  discount?: number;
  vat?: number;
  adjustment?: number;
}
