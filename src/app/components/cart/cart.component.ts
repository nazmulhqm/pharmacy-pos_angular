import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CartItem } from 'src/app/models/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent  implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private destroy$ = new Subject<void>();
  adjustment: number = 0;
  searchTerm: string = '';

  constructor(public cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCartItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
          this.cartItems = items;
      });
  }

  onQuantityChange(itemId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    this.cartService.updateQuantity(itemId, quantity);
  }
  
  onSearch(term: string) {
      this.searchTerm = term; 
  }
  
  filteredCartItems() {
    if (!this.searchTerm) {
      return this.cartItems;
    }
    return this.cartItems.filter(item => 
      item.product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onDiscountChange(itemId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const discount = parseFloat(input.value);
    if (discount >= 0 && discount <= 100) {
      this.cartService.updateDiscount(itemId, discount);
    }
  }

  onUnitChange(itemId: number, unit: 'piece' | 'strip' | 'box'): void {
    this.cartService.updateUnit(itemId, unit); 
  }

  removeItem(itemId: number): void {
    this.cartService.removeItem(itemId);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get totalAmount() {
    return this.cartService.getTotalAmount() + this.adjustment;
  }


  onAdjustmentChange(event: FocusEvent): void {
    const inputValue = (event.target as HTMLInputElement).value; 
    const adjustmentValue = parseFloat(inputValue) || 0; 
    this.cartService.setAdjustment(adjustmentValue);
    this.adjustment = this.cartService.getAdjustment();
  }
}