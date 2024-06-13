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
  currentDoctorId: number | null = null;
  currentUserRoleId: number | null = null;
  noPatients: boolean = false;

  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentDoctorId = this.getCurrentUserIdFromLocalStorage();
    this.currentUserRoleId = this.getCurrentUserRoleIdFromLocalStorage();

    if (this.currentUserRoleId === 3) {
      // Admin view: Load all patients and appointments
      this.loadAllPatientsAndAppointments();
    } else if (this.currentDoctorId !== null) {
      // Doctor view: Load patients and appointments for the current doctor
      this.loadPatientsAndAppointmentsForDoctor(this.currentDoctorId);
    } else {
      console.error('Current user ID or role ID not found in local storage');
    }
  }

  getCurrentUserIdFromLocalStorage(): number | null {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser) as UserDto;
      return user.userId ?? null;
    }
    return null;
  }

  getCurrentUserRoleIdFromLocalStorage(): number | null {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser) as UserDto;
      return user.roleId ?? null;
    }
    return null;
  }

  loadPatientsAndAppointmentsForDoctor(doctorId: number): void {
    this.userService.getAllUsersWithRoleId(2).subscribe(
      (data) => {
        this.patients = data.filter(user => user.roleId === 2); // Assuming roleId 2 is for patients
        this.loadAppointmentsForDoctor(doctorId);
      },
      (error) => {
        console.error('There was an error fetching the patients', error);
      }
    );
  }

  loadAllPatientsAndAppointments(): void {
    this.userService.getAllUsersWithRoleId(2).subscribe(
      (data) => {
        this.patients = data.filter(user => user.roleId === 2); // Assuming roleId 2 is for patients
        this.loadAllAppointments();
      },
      (error) => {
        console.error('There was an error fetching the patients', error);
      }
    );
  }

  loadAppointmentsForDoctor(doctorId: number): void {
    this.appointmentService.getAppointmentsByDoctor(doctorId).subscribe({
      next: (response) => {
        if (response.body) {
          this.patientAppointments = response.body;
          this.filterPatientsByDoctorAppointments(doctorId);
        }
      },
      error: (error) => {
        console.error('Error fetching appointments', error);
      }
    });
  }

  loadAllAppointments(): void {
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

  filterPatientsByDoctorAppointments(doctorId: number): void {
    const patientIdsWithAppointments = this.patientAppointments
      .filter(appt => appt.doctorId === doctorId)
      .map(appt => appt.patientId);

    this.patients = this.patients.filter(patient => 
      patient.userId !== undefined && patientIdsWithAppointments.includes(patient.userId));

    this.noPatients = this.patients.length === 0;
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
