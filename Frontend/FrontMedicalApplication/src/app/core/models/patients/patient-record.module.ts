import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientRecordEditComponent } from './patient-record-edit/patient-record-edit.component';
import { PatientRecordRoutingModule } from './patient-record-routing.module';

@NgModule({
  declarations: [
    PatientRecordEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PatientRecordRoutingModule
  ]
})
export class PatientRecordModule { }
