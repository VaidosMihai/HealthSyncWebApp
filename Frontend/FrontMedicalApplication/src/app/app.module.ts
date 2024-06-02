import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common'; 
import { AppointmentModule } from './core/models/appointments/appointment.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './auth/login-component/login-component.component';
import { SignupComponent } from './auth/signup-component/signup-component.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ForgotPassComponent } from './auth/forgot-pass/forgot-pass.component';
import { PatientProfileComponent } from './core/models/patients/patient-profile/patient-profile.component';
import { DoctorListComponent } from './core/models/doctor-list/doctor-list.component';
import { UserListComponent } from './core/models/user-list/user-list.component';
import { UserAddComponent } from './core/models/user-add/user-add.component';
import { UserEditComponent } from './core/models/user-edit/user-edit.component';
import { PatientListComponent } from './core/models/patients/patient-record-list/patient-record-list.component';
import { SearchResultComponent } from './core/models/search-result/search-result.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './core/services/auth-service.service';
import { MedicalRecordListComponent } from './core/models/medical-records/medical-record-list/medical-record-list.component';
import { MedicalRecordEditComponent } from './core/models/medical-records/medical-record-edit/medical-record-edit.component';
import { MedicalRecordNewComponent } from './core/models/medical-records/medical-record-new/medical-record-new.component';
import { NotificationListComponent } from './core/models/notification-list/notification-list.component';
import { DashboardComponent } from './core/models/dashboard/dashboard.component';
import { ContactinfoComponent } from './core/models/contactinfo/contactinfo.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ContactFormsListComponent } from './core/models/contact-forms-list/contact-forms-list.component';
import { AdminReportsComponent } from './core/models/admin-reports/admin-reports.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ForgotPassComponent,
    ResetPasswordComponent,
    PatientProfileComponent,
    DoctorListComponent,
    UserListComponent,
    UserAddComponent,
    UserEditComponent,
    PatientListComponent,
    SearchResultComponent,
    MedicalRecordEditComponent,
    MedicalRecordListComponent,
    MedicalRecordNewComponent,
    NotificationListComponent,
    DashboardComponent,
    LoginComponent,
    ContactinfoComponent,
    ContactFormsListComponent,
    AdminReportsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule, 
    HttpClientModule,
    AppRoutingModule,
    AppointmentModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatToolbarModule,
    RouterModule.forRoot(routes),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
