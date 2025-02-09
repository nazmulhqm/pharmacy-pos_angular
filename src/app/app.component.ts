import { Component, HostListener } from '@angular/core';
import { CartService } from './services/cart.service';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pharmacy-pos';
  isCategoryDrawerOpen = false;
  isPaymentDrawerOpen = false;
  isMobile: boolean = false;
  activeComponent: string = 'products';
  adjustment: number = 0;
  categories: any[] = [];
  isPaymentDrawerVisible = false;
  searchQuery: string = '';
  productFilter: any = {};

  constructor(public cartService: CartService, public productService: ProductService) {}

  ngOnInit() {
    this.loadCategories();
  }

  onCategorySelect(categoryId: number | null) {
    this.productService.setSelectedCategory(categoryId);
  }

  private loadCategories() {
    this.productService.getCategories().subscribe(
        categories => this.categories = categories
    );
  }  

  togglePaymentDrawer() {
    this.isPaymentDrawerOpen = !this.isPaymentDrawerOpen;
  }

  toggleCategoryDrawer() {
    this.isCategoryDrawerOpen = !this.isCategoryDrawerOpen;
  }
  
  @HostListener('window:resize', [])
  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  setActiveComponent(component: string): void {
    this.activeComponent = component; 
  }

  openPaymentDrawer() {
    this.isPaymentDrawerVisible = true;
  }

  onPaymentComplete(payment: any) {
    this.isPaymentDrawerVisible = false;
    this.cartService.clearCart();
  }

  resetAll() {
    this.searchQuery = '';
    this.cartService.clearCart();
    this.productFilter = {};
    this.isPaymentDrawerVisible = false;
  }
}
