import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.css']
})
export class CustomerModalComponent implements OnInit {
  customerForm:FormGroup;
  isVisible=false;
  customers:Customer[]=[];
  selectedCustomer:Customer|null=null;

  constructor(
    private fb:FormBuilder,
    private customerService:CustomerService
  ){
    this.customerForm=this.fb.group({
      name:['',Validators.required],
      mobile:[''],
      address:['']
    });
  }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
      }
    });
  }

  onCustomerSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const customerId = select.value;
    
    if (customerId) {
      this.selectedCustomer = this.customers.find(c => c.id === +customerId) || null;
    } else {
      this.selectedCustomer = null;
    }
  }

  onSubmit() {
    if (this.customerForm.valid) {
      this.customerService.addCustomer(this.customerForm.value).subscribe({
        next: () => {
          this.loadCustomers();
          this.hide();
        }
      });
    }
  }
  
  show() {
    this.isVisible = true;
    this.customerForm.reset();
  }

  hide() {
    this.isVisible = false;
  }
}
