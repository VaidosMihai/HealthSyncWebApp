import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentEditComponent } from './appointment-edit/appointment-edit.component';
import { AppointmentRoutingModule } from './appointment-routing.module';
import { AppointmentAddComponent } from './appointment-add/appointment-add.component';

@NgModule({
declarations: [
AppointmentListComponent,
AppointmentEditComponent,
AppointmentAddComponent
],
imports: [
CommonModule,
ReactiveFormsModule,
AppointmentRoutingModule
]
})
export class AppointmentModule { }
