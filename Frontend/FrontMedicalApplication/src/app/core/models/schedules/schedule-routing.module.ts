import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { ScheduleEditComponent } from './schedule-edit/schedule-edit.component';

const routes: Routes = [
  { path: 'schedules', component: ScheduleListComponent },
  { path: 'schedules/edit/:id', component: ScheduleEditComponent },
  // Add additional routes as needed
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
