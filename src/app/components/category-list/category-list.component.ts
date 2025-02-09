import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent {
  @Input() categories: Category[] = [];
  @Input() selectedCategoryId:number|null=null;
  @Input() totalProductCount:number=0;

  @Output() categorySelected=new EventEmitter<number|null>();

  onCategorySelect(categoryId:number|null):void{
    this.selectedCategoryId=categoryId;
    this.categorySelected.emit(categoryId);
  }
}
