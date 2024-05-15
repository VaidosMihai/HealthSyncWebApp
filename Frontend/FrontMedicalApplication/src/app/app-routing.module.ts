import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './auth/signup-component/signup-component.component';
import { LoginComponent } from './auth/login-component/login-component.component';
import { PatientListComponent } from '../app/core/models/patients/patient-record-list/patient-record-list.component';
import { AppointmentListComponent } from '../app/core/models/appointments/appointment-list/appointment-list.component';
import { AppointmentEditComponent } from '../app/core/models/appointments/appointment-edit/appointment-edit.component';
import { BillingListComponent } from '../app/core/models/billings/billing-list/billing-list.component';
import { BillingEditComponent } from '../app/core/models/billings/billing-edit/billing-edit.component';
import { ScheduleListComponent } from '../app/core/models/schedules/schedule-list/schedule-list.component';
import { ScheduleEditComponent } from '../app/core/models/schedules/schedule-edit/schedule-edit.component';
import { AppointmentAddComponent } from '../app/core/models/appointments/appointment-add/appointment-add.component';
import { ForgotPassComponent } from './auth/forgot-pass/forgot-pass.component';
import { PatientProfileComponent } from './core/models/patients/patient-profile/patient-profile.component';
import { DoctorListComponent } from './core/models/doctor-list/doctor-list.component';
import { UserListComponent } from './core/models/user-list/user-list.component';
import { UserEditComponent } from './core/models/user-edit/user-edit.component';
import { UserAddComponent } from './core/models/user-add/user-add.component';
import { SearchResultComponent } from './core/models/search-result/search-result.component';
import { roleGuard } from './core/guards/role/role.guard'; // Import the RoleGuard
import { MedicalRecordListComponent } from './core/models/medical-records/medical-record-list/medical-record-list.component';
import { MedicalRecordEditComponent } from './core/models/medical-records/medical-record-edit/medical-record-edit.component';
import { MedicalRecordNewComponent } from './core/models/medical-records/medical-record-new/medical-record-new.component';
import { NotificationListComponent } from './core/models/notification-list/notification-list.component';
import { DashboardComponent } from './core/models/dashboard/dashboard.component';
import { LocationComponent } from './core/models/location/location.component';
import { ContactinfoComponent } from './core/models/contactinfo/contactinfo.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'patients', component: PatientListComponent, canActivate: [roleGuard], data: { roles: [1, 3] } },  // Example: Accessible by Patient (2) and Admin (3)
  { path: 'profile', component: PatientProfileComponent },
  { path: 'appointment', component: AppointmentListComponent },
  { path: 'appointment/edit/:id', component: AppointmentEditComponent },
  { path: 'appointment/add', component: AppointmentAddComponent },
  { path: 'billing', component: BillingListComponent },
  { path: 'billing/edit/:id', component: BillingEditComponent },
  { path: 'schedule', component: ScheduleListComponent },
  { path: 'schedule/edit/:id', component: ScheduleEditComponent },
  { path: 'forgot-password', component: ForgotPassComponent },
  { path: 'doctors', component: DoctorListComponent, canActivate: [roleGuard], data: { roles: [2, 3] } },  // Example: Accessible by Doctor (1) and Admin (3)
  { path: 'users', component: UserListComponent, canActivate: [roleGuard], data: { roles: [3] } },  // Example: Accessible by Admin (3) only
  { path: 'user/edit/:id', component: UserEditComponent },
  { path: 'user/add', component: UserAddComponent },
  { path: 'search', component: SearchResultComponent },
  { path: 'medical-record/edit/:id', component: MedicalRecordEditComponent },
  { path: 'medical-record/list', component: MedicalRecordListComponent },
  { path: 'medical-record/new/:appointmentId', component: MedicalRecordNewComponent },
  { path: 'medical-record/view/:appointmentId', component: MedicalRecordEditComponent },
  { path: 'notifications', component: NotificationListComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'locations', component: LocationComponent },
  { path: 'contactinfo', component: ContactinfoComponent },


  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
