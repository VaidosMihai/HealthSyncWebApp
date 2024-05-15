import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentEditComponent } from './appointment-edit/appointment-edit.component';

const routes: Routes = [
  { path: 'appointment', component: AppointmentListComponent },
  { path: 'appointment/edit/:id', component: AppointmentEditComponent },
  // Add additional routes as needed
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule { }
