import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
  private apiUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getCategories():Observable<any>{
    return this.http.get(`${this.apiUrl}/Category/Get`);
  }

  getCategoryById(id:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/Category/Get/${id}`);
  }
}

