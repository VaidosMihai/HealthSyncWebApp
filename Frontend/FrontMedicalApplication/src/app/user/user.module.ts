import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientDashboardComponent } from './patient-dashboard-component/patient-dashboard-component.component';
import { DoctorDashboardComponent } from './doctor-dashboard-component/doctor-dashboard-component.component';
import { AdminDashboardComponent } from './admin-dashboard-component/admin-dashboard-component.component';
import { UnregisterDashboardComponent } from './unregister-dashboard-component/unregister-dashboard-component.component';

@NgModule({
  declarations: [PatientDashboardComponent, DoctorDashboardComponent, AdminDashboardComponent, UnregisterDashboardComponent],
  imports: [
    CommonModule
    // Other user-related modules
  ]
})
export class UserModule { }
