import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user-service.service';
import { AppointmentService } from '../../../services/appointment-service.service';
import { UserDto } from '../../../dtos/user.dto';
import { AppointmentDto } from '../../../dtos/appointment.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-record-list.component.html',
  styleUrls: ['./patient-record-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: UserDto[] = [];
  patientAppointments: AppointmentDto[] = [];
  filteredAppointments: AppointmentDto[] = [];
  upcomingAppointments: AppointmentDto[] = [];
  pastAppointments: AppointmentDto[] = [];
  isModalOpen = false;
  selectedPatient: UserDto | null = null;

  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.userService.getAllUsersWithRoleId(2).subscribe(
      (data) => {
        this.patients = data.filter(user => user.roleId === 2); // Assuming roleId 2 is for patients
        this.loadAppointments();
      },
      (error) => {
        console.error('There was an error fetching the patients', error);
      }
    );
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (response) => {
        if (response.body) {
          this.patientAppointments = response.body;
        }
      },
      error: (error) => {
        console.error('Error fetching appointments', error);
      }
    });
  }

  getNextAppointment(patientId: number | undefined): AppointmentDto | undefined {
    if (patientId === undefined) {
      return undefined;
    }
    const now = new Date();
    return this.patientAppointments
      .filter(appt => appt.patientId === patientId && new Date(appt.dateTime) > now)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0];
  }

  openModal(patient: UserDto): void {
    this.selectedPatient = patient;
    this.filteredAppointments = this.patientAppointments.filter(appt => appt.patientId === patient.userId);
    this.categorizeAppointments();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedPatient = null;
    this.filteredAppointments = [];
    this.upcomingAppointments = [];
    this.pastAppointments = [];
    this.router.navigate(['/patients']);
  }

  categorizeAppointments(): void {
    const now = new Date();
    this.upcomingAppointments = this.filteredAppointments.filter(appt => new Date(appt.dateTime) > now);
    this.pastAppointments = this.filteredAppointments.filter(appt => new Date(appt.dateTime) <= now);
  }
}
