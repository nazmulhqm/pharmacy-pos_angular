import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private apiUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getBrands():Observable<any>{
    return this.http.get(`${this.apiUrl}/Brand/Get`);
  }

  getBrandById(id:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/Brand/Get/${id}`);
  }
}
