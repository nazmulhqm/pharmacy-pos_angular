import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private vatRate = 0.05;
  private adjustment:number=0;

  constructor() { }

  addToCart(product:Product):void{
    const currentItems = this.cartItems.getValue();
    const existingItem = currentItems.find(item =>item.product.id === product.id);

    if(existingItem){
      if(existingItem.quantity<product.stock){
        existingItem.quantity++;
        existingItem.subTotal=this.calculateSubTotal(existingItem);
        this.cartItems.next([...currentItems]);
      }
    } else{
      const newItem:CartItem={
        product,
        quantity:1,
        discount:product.defaultDiscount||0,
        subTotal:0,
        unit:'piece'
      };
      newItem.subTotal=this.calculateSubTotal(newItem);
      this.cartItems.next([...currentItems,newItem]);
    }
  }

  getTotalDiscountAmount(): number {
    return this.cartItems.getValue()
        .reduce((totalDiscount, item) => {
            let quantityInPieces = 1;

             if (item.unit === 'strip') {
                quantityInPieces = 10; // 1 strip = 10 pieces
             } else if (item.unit === 'box') {
                quantityInPieces = 100; // 1 box = 100 pieces
             }

             const quantity = quantityInPieces * item.quantity;
             
            const discountAmount = item.product.price * (item.discount / 100) * quantity;
            return totalDiscount + discountAmount;
        }, 0);
  }

  
  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  getCartItemsCount(): number {
      return this.cartItems.getValue().length;
  }

  getSubTotal(): number {
      return this.cartItems.getValue()
          .reduce((total, item) => total + item.subTotal, 0);
  }

  getVatAmount(): number {
      return this.getSubTotal() * this.vatRate;
  }

  getTotalAmount(): number {
      const subtotal = this.getSubTotal();
      const vatAmount = this.getVatAmount();
      const adjustment = this.getAdjustment();
      const total = subtotal + vatAmount + adjustment; // Directly apply adjustment
      return parseFloat(total.toFixed(2)); // Ensure two decimal places
  }

  getDiscountAmount(): number {
      return this.cartItems.getValue()
          .reduce((totalDiscount, item) => {
              const priceAfterDiscount = item.product.price * (1 - item.discount / 100);
              const discountAmount = (item.product.price - priceAfterDiscount) * item.quantity;
              return totalDiscount + discountAmount;
          }, 0);
  }

  getAdjustment(): number {
    return this.adjustment; // Get adjustment value
  }

  updateQuantity(itemId: number, quantity: number): void {
    const currentItems = this.cartItems.getValue();
    const item = currentItems.find(item => item.product.id === itemId);
    
    if (item) {
        if (quantity < 1) {
            this.removeItem(itemId);
            return;
        }
        
        if (quantity <= item.product.stock) {
            item.quantity = quantity;
            item.subTotal = this.calculateSubTotal(item);
            this.cartItems.next([...currentItems]);
        }
    }
  }

  updateDiscount(itemId: number, discount: number): void {
      const currentItems = this.cartItems.getValue();
      const item = currentItems.find(item => item.product.id === itemId);

      if (item) {
          item.discount = discount;
          item.subTotal = this.calculateSubTotal(item);
          this.cartItems.next([...currentItems]);
      }
  }

  updateUnit(itemId: number, unit: 'piece' | 'strip' | 'box'): void {
      const currentItems = this.cartItems.getValue();
      const item = currentItems.find(item => item.product.id === itemId);

      if (item) {
          item.unit = unit; // Update the unit
          item.subTotal = this.calculateSubTotal(item); // Recalculate subtotal
          this.cartItems.next([...currentItems]);
      }
  }

  setAdjustment(value: number): void {
    const totalAmount = this.getTotalAmount(); // Get the current total amount
    const adjustedTotal = totalAmount + value;

    // Ensure total doesn't go negative
    if (adjustedTotal < 0) {
        this.adjustment = -totalAmount; // Prevent adjustment that makes the total negative
    } else {
        this.adjustment = value; // Set the adjustment value as requested
    }
  }
  
  removeItem(itemId: number): void {
    const currentItems = this.cartItems.getValue();
    this.cartItems.next(currentItems.filter(item => item.product.id !== itemId));
  }

  clearCart(): void {
      this.setAdjustment(0);
      this.cartItems.next([]);
  }

  private calculateSubTotal(item: CartItem): number {
    let quantityInPieces = 1;

    if (item.unit === 'strip') {
        quantityInPieces = 10; // 1 strip = 10 pieces
    } else if (item.unit === 'box') {
        quantityInPieces = 100; // 1 box = 100 pieces
    }
      const quantity = quantityInPieces * item.quantity;
      const priceAfterDiscount = item.product.price * (1 - item.discount / 100);
      return priceAfterDiscount * quantity;
  }
}
