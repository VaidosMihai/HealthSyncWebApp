import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../services/appointment-service.service';
import { AppointmentDto } from '../../../dtos/appointment.dto';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth-service.service';
import { UserService } from '../../../services/user-service.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointments: AppointmentDto[] = [];
  doctorName: string = "";
  isPatient: boolean = false;
  isDoctor: boolean = false;
  isAdmin: boolean = false;
  patientNames: { [key: number]: string } = {};
  doctorNames: { [key: number]: string } = {};
  upcomingAppointments: AppointmentDto[] = [];
  pastAppointments: AppointmentDto[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.checkUserRole();
    this.setDoctorName();
    if (currentUser) {
      if (currentUser.roleId === 3) {
        this.loadAppointmentsForAdmin();
      } else if (currentUser.roleId === 2) {
        this.loadAppointmentsForLoggedInPatient();
      } else if (currentUser.roleId === 1) {
        this.loadAppointmentsForMedic();
      }
    }
  }

  setDoctorName() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser) {
      this.doctorName = `${currentUser.firstName} ${currentUser.lastName}`;
    }
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe({
      next: (response: HttpResponse<AppointmentDto[]>) => {
        if (response.body) {
          this.appointments = response.body;
          this.categorizeAppointments(this.appointments);
          this.populatePatientNames();
        }
      },
      error: (error) => {
        console.error('Error fetching appointments', error);
      }
    });
  }

  loadAppointmentsForAdmin() {
    this.appointmentService.getAppointments().subscribe({
      next: (response: HttpResponse<AppointmentDto[]>) => {
        if (response.body) {
          this.appointments = response.body;
          this.populatePatientNames();
          this.categorizeAppointments(this.appointments);
        }
      },
      error: (error) => {
        console.error('Error fetching appointments', error);
      }
    });
  }

  loadAppointmentsForMedic() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
    this.appointmentService.getAppointments().subscribe({
      next: (response: HttpResponse<AppointmentDto[]>) => {
        if (response.body) {
          let filteredAppointments;
          if (currentUser.roleId === 1) { // Doctor
            filteredAppointments = response.body.filter(appt => appt.doctorId === currentUser.userId);
          } else if (currentUser.roleId === 2) { // Patient
            filteredAppointments = response.body.filter(appt => appt.patientId === currentUser.userId);
          }
  
          if (filteredAppointments) {
            this.appointments = filteredAppointments;
            this.populatePatientNames();
            this.categorizeAppointments(this.appointments);
          } else {
            this.appointments = []; // Set appointments to empty array if no matches
          }
        }
      },
      error: (error) => {
        console.error('Error fetching appointments', error);
      }
    });
  }

  loadAppointmentsForLoggedInDoctor() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.roleId === 1) {
      this.appointmentService.getAppointmentsByDoctor(currentUser.userId).subscribe({
        next: (appointments: AppointmentDto[]) => {
          this.appointments = appointments;
          this.populatePatientNames();
          this.categorizeAppointmentsDoctor(this.appointments);
        },
        error: (error) => console.error('Error fetching appointments', error)
      });
    }
  }

  loadAppointmentsForLoggedInPatient() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.roleId === 2) {
      this.appointmentService.getAppointmentsByPatient(currentUser.userId).subscribe({
        next: (appointments: AppointmentDto[]) => {
          this.appointments = appointments;
          this.populatePatientNames();
          this.categorizeAppointments(this.appointments);
        },
        error: (error) => console.error('Error fetching appointments for patient', error)
      });
    }
  }

  populatePatientNames() {
    this.appointments.forEach(appointment => {
      if (!this.patientNames[appointment.patientId]) {
        this.userService.getUserById(appointment.patientId).subscribe(
          user => this.patientNames[appointment.patientId] = `${user.name} ${user.surname}`,
          error => console.error(`Failed to fetch patient name for ID ${appointment.patientId}`, error)
        );
      }
      if (!this.doctorNames[appointment.doctorId]) {
        this.userService.getUserById(appointment.doctorId).subscribe(
          user => this.doctorNames[appointment.doctorId] = `${user.name} ${user.surname}`,
          error => console.error(`Failed to fetch doctor name for ID ${appointment.doctorId}`, error)
        );
      }
    });
  }

  checkUserRole() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isDoctor = currentUser.roleId === 1;
    this.isPatient = currentUser.roleId === 2;
    this.isAdmin = currentUser.roleId === 3;
  }

  editAppointment(appointmentId: number) {
    this.router.navigate(['appointment/edit', appointmentId]);
  }

  deleteAppointment(appointmentId: number): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(appointmentId).subscribe({
        next: () => {
          alert(`Appointment with id ${appointmentId} deleted successfully.`);
          this.ngOnInit();
        },
        error: (error) => {
          console.error(`Error deleting appointment with id ${appointmentId}`, error);
          alert('There was an error deleting the appointment.');
        }
      });
    }
  }

  categorizeAppointments(appointments: AppointmentDto[]) {
    const now = new Date();
    this.upcomingAppointments = appointments.filter(appt => new Date(appt.dateTime) > now);
    this.pastAppointments = appointments.filter(appt => new Date(appt.dateTime) <= now);
  }

  categorizeAppointmentsDoctor(appointments: AppointmentDto[]) {
    const now = new Date();
    this.upcomingAppointments = appointments.filter(appt => new Date(appt.dateTime) > now);
    this.pastAppointments = appointments.filter(appt => new Date(appt.dateTime) <= now);
  }
}
