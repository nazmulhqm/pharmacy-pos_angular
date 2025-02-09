import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Payment } from 'src/app/models/payment';
import { Sale } from 'src/app/models/sale';
import { SaleItem } from 'src/app/models/sale-item';
import { CartService } from 'src/app/services/cart.service';
import { SaleService } from 'src/app/services/sale.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
 
  @Input() total = 0;
  @Input() adjustment = 0;
  @Input() isMobile = false;
  @Output() close = new EventEmitter<void>();

  paymentForm: FormGroup;
  paymentMethods: Array<'Cash' | 'Bank' | 'MFS'> = ['Cash', 'Bank', 'MFS'];
  Math = Math; 

  constructor(
      private fb: FormBuilder,
      private cartService: CartService,
      private saleService: SaleService
  ) {
      this.paymentForm = this.fb.group({
          method: ['Cash', Validators.required],
          providedAmount: [0, [Validators.required, Validators.min(0)]]
      });
  }

  @HostListener('window:resize', [])
  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnInit(): void {
    this.checkIfMobile();
  }

  get returnAmount(): number {
      const providedAmount = this.paymentForm.get('providedAmount')?.value || 0;
      return Math.max(0, providedAmount - this.total);
  }

  get remainingAmount(): number {
      const providedAmount = this.paymentForm.get('providedAmount')?.value || 0;
      return Math.max(0, this.total - providedAmount);
  }

  get totalDiscount(): number {
    return this.cartService.getTotalDiscountAmount();
  }

  private getSelectedCustomerId(): number | undefined {
    const selectedCustomer = document.querySelector('.customer-select-container select') as HTMLSelectElement;
    return selectedCustomer?.value ? Number(selectedCustomer.value) : undefined;
}

  onSubmit(): void {
      if (this.paymentForm.valid && this.paymentForm.value.providedAmount >= this.total) {
          const payment: Payment = {
              method: this.paymentForm.value.method,
              amount: this.total,
              taken: this.paymentForm.value.providedAmount,
              return: this.returnAmount
          };

          const cartItems = this.cartService.getCartItems();
          const totalDiscount = this.cartService.getTotalDiscountAmount(); 
          const vatAmount = this.cartService.getVatAmount(); 
          const adjustment = this.cartService.getAdjustment();

          const saleItems: SaleItem[] = [];
          cartItems.subscribe(items => {
              items.forEach(item => {
                  saleItems.push({
                      productId: item.product.id,
                      quantity: item.quantity,
                      price: item.product.price,
                      discount: item.discount
                  });
              });
          });
          
          const sale: Sale = {
              total: this.cartService.getTotalAmount(),
              customerId: this.getSelectedCustomerId() || undefined,
              saleItems: saleItems,
              payment: payment,
              discount: totalDiscount,
              vat: vatAmount,
              adjustment: adjustment
          };

          this.saleService.saveSale(sale).subscribe({
              next: () => {
                  this.close.emit();
                  this.cartService.clearCart();
                  this.resetForm();
              }
          });
      }
  }

  resetForm(): void {
      this.paymentForm.reset({
          method: 'Cash',
          providedAmount: 0
      });
  }

  onClose(): void {
    this.saleService.closeDrawer();
      this.close.emit();
      this.resetForm();
  }

}


