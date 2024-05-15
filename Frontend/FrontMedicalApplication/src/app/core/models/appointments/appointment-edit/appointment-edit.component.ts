// appointment-edit.component.ts
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
    // Initialize the form
    this.appointmentForm = this.fb.group({
      doctorId: ['', [Validators.required, Validators.min(1)]],
      patientId: ['', [Validators.required, Validators.min(1)]],
      dateTime: ['', Validators.required],
      reason: ['']
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['id']) {
      this.isEditMode = true;
      this.appointmentId = Number(this.route.snapshot.params['id']);
      // If in edit mode, load the existing appointment details
      this.appointmentService.getAppointmentById(this.appointmentId).subscribe(appointment => {
        this.appointmentForm.patchValue(appointment);
      });
    }
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      if (this.isEditMode && this.appointmentId) {
        // Update the existing appointment
        this.appointmentService.updateAppointment(this.appointmentId, this.appointmentForm.value).subscribe({
          next: () => this.router.navigate(['/appointment']),
          error: err => console.error('Error updating appointment:', err)
        });
      } else {
        // Create a new appointment
        this.appointmentService.createAppointment(this.appointmentForm.value).subscribe({
          next: () => this.router.navigate(['/appointment']),
          error: err => console.error('Error creating new appointment:', err)
        });
      }
    }
  }
}
