import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../../services/appointment-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../../../services/user-service.service';
import { forkJoin } from 'rxjs';
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
  patientId: number | undefined; // Optional if you want to auto-fill patientId too
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
        const patientUsername = params['patientUsername']; // Assuming you have the patient's username
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
            this.doctorId = doctor.userId; // Store the doctor's ID
            this.appointmentForm.get('doctorId')?.setValue(this.doctorId);
          }
        );
      }
      const patientUserJson = localStorage.getItem('currentUser');
      if (patientUserJson) {
        const patientUser = JSON.parse(patientUserJson);
        this.patientId = patientUser.userId; // Assume you have a userId field in your UserDto
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

      // Convert doctorUsername and patientUsername to their respective IDs
      this.userService.getUserByUsername(formValues.doctorUsername).pipe(
        switchMap((doctor: UserDto) => {
          formValues.doctorId = doctor.userId; // Set doctorId to the fetched doctor's ID
          return this.userService.getUserByUsername(formValues.patientUsername);
        }),
        switchMap((patient: UserDto) => {
          formValues.patientId = patient.userId; // Set patientId to the fetched patient's ID
          return this.appointmentService.createAppointment(new AppointmentDto(
            formValues.patientId,
            formValues.doctorId,
            new Date(formValues.date), // Make sure this is a Date object
            formValues.reason
          ));
        })
      ).subscribe({
        next: (response) => {
          console.log('Appointment created successfully:', response);
          alert("Appointment created successfully");
          this.router.navigate(['/appointment']);
        },
        error: (error) => {
          console.error('Error creating appointment', error);
        }
      });
    }
  }
}
