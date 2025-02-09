import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Output() paymentButtonClicked = new EventEmitter<void>();
  @Output() resetButtonClicked = new EventEmitter<void>();
  @Output() setActiveComponent = new EventEmitter<string>();
  @Input() isMobile: boolean = false;
  @Input() activeComponent: string = 'products';

  isPaymentDrawerVisible=false;

  constructor(public cartService:CartService){}

  ngOnInit(){
    this.checkIfMobile();
  }

  @HostListener('window:resize', [])
    checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  onReset() {
    this.cartService.clearCart();
  }

  openPaymentDrawer() {
    this.paymentButtonClicked.emit();
  }
  onPaymentComplete(payment: any) {  
    this.isPaymentDrawerVisible = false;
    this.cartService.clearCart();
  }

  onPaymentButtonClick() {
    this.paymentButtonClicked.emit();
  }

  onResetButtonClick() {
    this.resetButtonClicked.emit();
  }

  togglePaymentDrawer() {
    this.isPaymentDrawerVisible = !this.isPaymentDrawerVisible;
  }
}
