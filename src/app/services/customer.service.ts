import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getCustomers():Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/Customer/Get`);
  }

  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/Customer/Post`, customer);
  }
}
