import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { ScheduleEditComponent } from './schedule-edit/schedule-edit.component';
import { ScheduleRoutingModule } from './schedule-routing.module';

@NgModule({
  declarations: [
    ScheduleListComponent,
    ScheduleEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ScheduleRoutingModule
  ]
})
export class ScheduleModule { }
