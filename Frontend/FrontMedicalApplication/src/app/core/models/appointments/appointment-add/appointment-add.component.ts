import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../../services/appointment-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { UserService } from '../../../services/user-service.service';
import { forkJoin, of } from 'rxjs';
import { UserDto } from '../../../dtos/user.dto';
import { AppointmentDto } from '../../../dtos/appointment.dto';
import { AuthService } from '../../../services/auth-service.service';

@Component({
  selector: 'app-appointment-add',
  templateUrl: './appointment-add.component.html',
  styleUrls: ['./appointment-add.component.css']
})
export class AppointmentAddComponent implements OnInit {
  appointmentForm: FormGroup;
  doctorId: number | undefined;
  patientId: number | undefined;
  doctors: UserDto[] = [];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.appointmentForm = this.fb.group({
      doctorId: ['', Validators.required],
      patientId: ['', Validators.required],
      doctorUsername: ['', Validators.required],
      patientUsername: ['', Validators.required],
      date: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadDoctors();
    this.route.queryParams.pipe(
      switchMap(params => {
        const doctorUsername = params['doctorUsername'];
        const patientUsername = params['patientUsername'];
        return forkJoin({
          doctor: this.userService.getUserByUsername(doctorUsername),
          patient: this.userService.getUserByUsername(patientUsername),
        });
      })
    ).subscribe(result => {
      if (result.doctor && result.patient) {
        this.appointmentForm.patchValue({
          doctorId: result.doctor.userId,
          patientId: result.patient.userId,
          doctorUsername: result.doctor.username,
          patientUsername: result.patient.username,
        });
      }
    });
    this.route.queryParams.subscribe(params => {
      const doctorUsername = params['doctorUsername'];
      if (doctorUsername) {
        this.userService.getUserByUsername(doctorUsername).subscribe(
          doctor => {
            this.doctorId = doctor.userId;
            this.appointmentForm.get('doctorId')?.setValue(this.doctorId);
          }
        );
      }
      const patientUserJson = localStorage.getItem('currentUser');
      if (patientUserJson) {
        const patientUser = JSON.parse(patientUserJson);
        this.patientId = patientUser.userId;
        this.appointmentForm.get('patientId')?.setValue(this.patientId);
        this.appointmentForm.get('patientUsername')?.setValue(patientUser.username);
      }
    });
  }

  loadDoctors() {
    this.userService.getUsersByRole(1).subscribe(
      doctors => this.doctors = doctors,
      error => console.error('Error fetching doctors:', error)
    );
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const formValues = this.appointmentForm.value;
      let doctorId: number;
      let patientId: number;

      this.userService.getUserByUsername(formValues.doctorUsername).pipe(
        switchMap((doctor: UserDto) => {
          if (!doctor.userId) throw new Error('Doctor ID not found');
          doctorId = doctor.userId!;
          formValues.doctorId = doctorId;
          return this.userService.getUserByUsername(formValues.patientUsername);
        }),
        switchMap((patient: UserDto) => {
          if (!patient.userId) throw new Error('Patient ID not found');
          patientId = patient.userId!;
          formValues.patientId = patientId;
          return this.appointmentService.createAppointment(new AppointmentDto(
            patientId,
            doctorId,
            new Date(formValues.date),
            formValues.reason
          ));
        }),
        switchMap((appointment: AppointmentDto) => {
          return this.appointmentService.notifyDoctor(doctorId);
        }),
        catchError((error) => {
          console.error('Error in the appointment creation process:', error);
          return of(null);
        })
      ).subscribe({
        next: (response) => {
          console.log('Appointment created and doctor notified successfully:', response);
          alert("Appointment created and doctor notified successfully");
          this.router.navigate(['/appointment']);
        },
        error: (error) => {
          console.error('Error creating appointment and notifying doctor', error);
          alert("Failed to create appointment and notify doctor");
        }
      });
    }
  }
}
