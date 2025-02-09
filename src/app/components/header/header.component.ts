import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  @Input() isMobile: boolean = false;
  @Output() setActiveComponent = new EventEmitter<string>();
  @Input() activeComponent: string = '';
  @Output() menuClick = new EventEmitter<void>();
  currentTime: string = '';

  menus = [
    { title: 'Report', icon: 'summarize', class: 'header-btn' },
    { title: 'Return', icon: 'rotate_left', class: 'header-btn' },
    { title: 'Recent', icon: 'history', class: 'header-btn' },
    { title: 'Draft', icon: 'edit', class: 'header-warn-btn' }
  ];

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
    this.checkIfMobile();
  }

  @HostListener('window:resize', [])
  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime = `${this.formatTime(now)}  ||  ${this.formatDate(now)}`;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB');
  }

  onMenuClick(): void {
    this.menuClick.emit();
  }
}