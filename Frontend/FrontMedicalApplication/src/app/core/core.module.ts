import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AuthService } from './services/auth-service.service';
import { AppointmentService } from './services/appointment-service.service';
import { PatientService } from './services/patient-service.service';
import { MedicalRecordService } from './services/medical-record.service';
import { ScheduleService } from './services/schedule-service.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    AuthService,
    AppointmentService,
    PatientService,
    MedicalRecordService,
    ScheduleService,
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
