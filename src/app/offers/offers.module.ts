import { OffersRoutingModule } from './offers-routing-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffersComponent } from './offers/offers.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [OffersComponent],
  imports: [
    CommonModule,
    SharedModule,
    OffersRoutingModule
  ]
})
export class OffersModule { }
