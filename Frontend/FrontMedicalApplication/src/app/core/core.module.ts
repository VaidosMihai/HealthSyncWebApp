import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Import singleton services here
import { AuthService } from './services/auth-service.service';
import { AppointmentService } from './services/appointment-service.service';
import { PatientService } from './services/patient-service.service';
import { BillingService } from './services/billing-service.service';
import { MedicalRecordService } from './services/medical-record.service';
import { ScheduleService } from './services/schedule-service.service';
import { TreatmentService } from './services/treatment-service.service';
// Add other core services as needed

// Import any application-wide components, directives, or pipes
/* import { HeaderComponent } from '../shared/header-component/header-component.component';
import { FooterComponent } from '../shared/footer-component/footer-component.component'; */

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule, // Now available app-wide
    RouterModule // Now available app-wide
    // Other modules that are used application-wide
  ],
  providers: [
    // Register singleton services
    AuthService,
    AppointmentService,
    PatientService,
    BillingService,
    MedicalRecordService,
    ScheduleService,
    TreatmentService,
    // Add other services as needed
  ],
  declarations: [
    // Application-wide components
    /* HeaderComponent,
    FooterComponent, */
    // ...other declarations
  ],
  exports: [
    // Re-export shared modules and components
    /* HeaderComponent,
    FooterComponent, */
    // ...other exports
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
