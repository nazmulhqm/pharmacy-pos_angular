import { Product } from "./product";

export interface CartItem {
  product:Product;
  quantity:number;
  discount:number;
  subTotal:number;
  unit:'piece'|'strip'|'box';
}
