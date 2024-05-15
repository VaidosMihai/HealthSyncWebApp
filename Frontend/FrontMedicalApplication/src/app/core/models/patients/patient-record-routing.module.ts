import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientListComponent } from './patient-record-list/patient-record-list.component';
import { PatientRecordEditComponent } from './patient-record-edit/patient-record-edit.component';

const routes: Routes = [
  { path: 'patient-records/edit/:id', component: PatientRecordEditComponent },
  // Add additional routes as needed
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRecordRoutingModule { }
