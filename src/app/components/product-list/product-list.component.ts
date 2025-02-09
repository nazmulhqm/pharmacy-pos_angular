import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
    @Input() activeComponent: string = 'products';

  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  loading = false;
  searchTerm = '';
  @Input() isMobile: boolean = false;
  
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(public productService: ProductService, private cartService: CartService) {
      this.searchSubject.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
      ).subscribe(term => {
          this.products = [];
          this.loadProducts();
      });
  }

  @HostListener('window:resize', [])
  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }
  
  ngOnInit() {
      this.loadCategories();
      this.loadBrands();
      this.loadProducts();

      this.productService.selectedCategory$.pipe(
          takeUntil(this.destroy$)
      ).subscribe(() => this.resetAndReload());

      this.productService.selectedBrand$.pipe(
          takeUntil(this.destroy$)
      ).subscribe(() => this.resetAndReload());
  }

  onSearch(term: string) {
      this.searchTerm = term;
      this.searchSubject.next(term);
  }
  
  onCategorySelect(categoryId: number | null) {
      this.productService.setSelectedCategory(categoryId);
  }

  onBrandSelect(event: Event) {
      const select = event.target as HTMLSelectElement;
      const brandId = select.value ? Number(select.value) : null;
      this.productService.setSelectedBrand(brandId);
  }

  onProductSelect(product: Product) {
      if (product.stock > 0) {
          this.cartService.addToCart(product);
      }
  }

  ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
  }

  private loadProducts() {
      this.productService.getProducts(
          this.productService.getCurrentCategory(),
          this.productService.getCurrentBrand(),
          this.searchTerm
      ).subscribe({
        next: (products) => {
            this.products = products; 
        }
      });
  }

  private resetAndReload() {
      this.products = [];
      this.loadProducts();
  }

  private loadCategories() {
      this.productService.getCategories().subscribe(
          categories => this.categories = categories
      );
  }

  private loadBrands() {
      this.productService.getBrands().subscribe(
          brands => this.brands = brands
      );
  }

  
}

