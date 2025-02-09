export interface Payment {
  id?:number;
  saleId?:number;
  amount:number;
  method:'Cash'|'Bank'|'MFS';
  taken?:number;
  return?:number;
}
