import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BillingListComponent } from './billing-list/billing-list.component';
import { BillingEditComponent } from './billing-edit/billing-edit.component';
import { BillingRoutingModule } from './billing-routing.module';

@NgModule({
  declarations: [
    BillingListComponent,
    BillingEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BillingRoutingModule
  ]
})
export class BillingModule { }
