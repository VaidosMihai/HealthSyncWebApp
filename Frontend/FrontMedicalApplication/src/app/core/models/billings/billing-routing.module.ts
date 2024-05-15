import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingListComponent } from './billing-list/billing-list.component';
import { BillingEditComponent } from './billing-edit/billing-edit.component';

const routes: Routes = [
  { path: 'billing', component: BillingListComponent },
  { path: 'billing/edit/:id', component: BillingEditComponent },
  // Add additional routes as needed
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
