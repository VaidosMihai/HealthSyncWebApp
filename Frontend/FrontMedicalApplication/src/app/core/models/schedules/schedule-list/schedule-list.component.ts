import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../../services/schedule-service.service';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.css']
})
export class ScheduleListComponent implements OnInit {
  schedules: any[] = [];

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit() {
    this.scheduleService.getSchedules().subscribe(
      (data) => {
        this.schedules = data;
      },
      (error) => {
        // Handle errors here
      }
    );
  }
}
