import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../../services/appointment-service.service';
import { AppointmentDto } from '../../../dtos/appointment.dto';

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.css']
})
export class AppointmentEditComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditMode: boolean = false;
  appointmentId?: number;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.appointmentForm = this.fb.group({
      doctorId: ['', [Validators.required, Validators.min(1)]],
      patientId: ['', [Validators.required, Validators.min(1)]],
      dateTime: ['', Validators.required],
      reason: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.isEditMode = true;
      this.appointmentId = Number(this.route.snapshot.params['id']);
      this.appointmentService.getAppointmentById(this.appointmentId).subscribe(appointment => {
        this.appointmentForm.patchValue(appointment);
      });
    }
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      if (this.isEditMode && this.appointmentId) {
        const updatedAppointment: AppointmentDto = {
          ...this.appointmentForm.value,
          status: 'Pending'
        };
        this.appointmentService.updateAppointment(this.appointmentId, updatedAppointment).subscribe({
          next: () => {
            this.sendNotification(updatedAppointment.patientId, `Your appointment has been rescheduled to ${updatedAppointment.dateTime}.`);
            this.router.navigate(['/appointment']);
          },
          error: err => console.error('Error updating appointment:', err)
        });
      } else {
        this.appointmentService.createAppointment(this.appointmentForm.value).subscribe({
          next: () => this.router.navigate(['/appointment']),
          error: err => console.error('Error creating new appointment:', err)
        });
      }
    }
  }

  sendNotification(userId: number, message: string): void {
    this.appointmentService.notifyUser(userId, message).subscribe({
      next: () => console.log('Notification sent'),
      error: err => console.error('Error sending notification:', err)
    });
  }
}
