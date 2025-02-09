import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';
import { CategoryService } from './category.service';
import { Category } from '../models/category';
import { BrandService } from './brand.service';
import { Brand } from '../models/brand';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl;

  private selectedCategory = new BehaviorSubject<number|null>(null);
  private selectedBrand = new BehaviorSubject<number|null>(null);

  constructor(private http:HttpClient, 
              private categoryService:CategoryService,
              private brandService:BrandService) { }

  getProducts(
    categoryId?: number | null,
    brandId?: number | null,
    searchTerm?: string
  ): Observable<Product[]> {
      let url = `${this.apiUrl}/product/GetByQuery?`;

      if (categoryId) url += `&categoryId=${categoryId}`;
      if (brandId) url += `&brandId=${brandId}`;
      if (searchTerm) url += `&searchTerm=${searchTerm}`;

      return this.http.get<Product[]>(url);
  }

  getCategories(): Observable<Category[]> {
    return this.categoryService.getCategories();
  }

  getBrands(): Observable<Brand[]> {
    return this.brandService.getBrands();
  }

  getCurrentCategory(): number | null {
    return this.selectedCategory.getValue();
  }

  getCurrentBrand(): number | null {
    return this.selectedBrand.getValue();
  }

  setSelectedCategory(categoryId: number | null) {
    this.selectedCategory.next(categoryId);
  }

  setSelectedBrand(brandId: number | null) {
    this.selectedBrand.next(brandId);
  }

  get selectedCategory$() {
    return this.selectedCategory.asObservable();
  }

  get selectedBrand$() {
    return this.selectedBrand.asObservable();
  }
}
