import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from '../../../services/schedule-service.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-schedule-edit',
  templateUrl: './schedule-edit.component.html',
  styleUrls: ['./schedule-edit.component.css']
})
export class ScheduleEditComponent implements OnInit {
  scheduleForm: FormGroup;
  scheduleId: number;

  constructor(
    private scheduleService: ScheduleService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.scheduleForm = this.fb.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
      // Add other form controls as needed
    });
    this.scheduleId = +this.route.snapshot.params['id'];
  }

  ngOnInit() {
    if (this.scheduleId) {
      this.scheduleService.getScheduleById(this.scheduleId).subscribe(
        (schedule) => {
          this.scheduleForm.patchValue(schedule);
        },
        (error: Error) => {
          // Handle error
        }
      );
    }
  }

  saveSchedule() {
    if (this.scheduleForm.valid) {
      const scheduleData = this.scheduleForm.value;
      if (this.scheduleId) {
        this.scheduleService.updateSchedule(this.scheduleId, scheduleData).subscribe(
          () => {
            // Handle successful update
          },
          (error: Error) => {
            // Handle update error
          }
        );
      } else {
        this.scheduleService.createSchedule(scheduleData).subscribe(
          () => {
            // Handle successful creation
          },
          (error: Error) => {
            // Handle creation error
          }
        );
      }
    }
  }
}
