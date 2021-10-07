import { NgModule } from '@angular/core';
import { NgxFilterSearchComponent } from './ngx-filter-search.component';
import { SliderModule } from '@syncfusion/ej2-angular-inputs';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [NgxFilterSearchComponent],
  imports: [
    BrowserModule,
    CommonModule,
    SliderModule,
    FormsModule,
    
  ],
  exports: [NgxFilterSearchComponent]
})
export class NgxFilterSearchModule { }
