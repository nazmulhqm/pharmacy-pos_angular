export interface Product {
  id:number;
  name:string;
  description:string;
  categoryId:number;
  productImage:string | null
  stock:number;
  price:number;
  brandId:number;
  defaultDiscount?:number
}
