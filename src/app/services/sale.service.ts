import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductService } from './product.service';
import { Product } from '../models/product';
import { Sale } from '../models/sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = environment.apiUrl;
  private cartItems = new BehaviorSubject<Map<number, number>>(new Map());
  private isVisibleSubject = new BehaviorSubject<boolean>(false);
  isVisible$ = this.isVisibleSubject.asObservable();

  constructor(
    private http: HttpClient,
    private productService: ProductService 
  ) {}

  openDrawer() {
    this.isVisibleSubject.next(true);
  }

  closeDrawer() {
    this.isVisibleSubject.next(false);
  }

  getProducts(): Observable<Product[]> {
    return this.productService.getProducts();
  }

  addToCart(productId: number): void {
    const currentCart = this.cartItems.value;
    if (!currentCart.has(productId)) {
      currentCart.set(productId, 1);
      this.cartItems.next(currentCart);
    }
  }

  updateCartQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartItems.value;
    if (quantity <= 0) {
      currentCart.delete(productId);
    } else {
      currentCart.set(productId, quantity);
    }
    this.cartItems.next(currentCart);
  }

  getCartItems(): Observable<Map<number, number>> {
    return this.cartItems.asObservable();
  }

  saveSale(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(`${this.apiUrl}/Sales/Post`, sale);
  }
}
