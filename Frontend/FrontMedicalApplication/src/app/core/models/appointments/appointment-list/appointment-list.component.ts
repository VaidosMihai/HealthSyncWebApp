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
  sortedAppointments: AppointmentDto[] = [];
  doctorName: string = "";
  isPatient: boolean = false;
  isDoctor: boolean = false;
  isAdmin: boolean = false;
  hasDiagnostics: boolean = false;
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
      } else {
        this.loadAppointments();
      }
    }
  }

  setDoctorName() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser) {
      this.doctorName = `${currentUser.firstName} ${currentUser.lastName}`;
    }
  }

  loadAppointmentsForAdmin() {
    this.appointmentService.getAppointments().subscribe({
      next: (response: HttpResponse<AppointmentDto[]>) => {
        if (response.body) {
          this.appointments = response.body;
          this.populatePatientNames();
          this.categorizeAppointments(this.appointments);
          this.sortedAppointments = [...this.upcomingAppointments]; // Initialize sortedAppointments
        }
      },
      error: (error) => {
        console.error('Error fetching appointments', error);
      }
    });
  }

  loadAppointments() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (currentUser) {
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
              this.sortedAppointments = [...this.upcomingAppointments]; // Initialize sortedAppointments
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
      if (appointment.patientRecordId) {
        this.hasDiagnostics = true;
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

  acceptAppointment(appointmentId: number) {
    const appointment = this.appointments.find(appt => appt.appointmentId === appointmentId);
    if (appointment) {
      appointment.status = 'Accepted';
      this.appointmentService.acceptAppointment(appointmentId).subscribe({
        next: (updatedAppointment) => {
          console.log('Appointment status updated to Accepted', updatedAppointment);
          this.ngOnInit();
        },
        error: (error) => {
          console.error('Failed to update appointment status', error);
        }
      });
    }
  }

  declineAppointment(appointmentId: number) {
    const appointment = this.appointments.find(appt => appt.appointmentId === appointmentId);
    if (appointment) {
      appointment.status = 'Declined';
      this.appointmentService.declineAppointment(appointmentId).subscribe({
        next: (updatedAppointment) => {
          console.log('Appointment status updated to Declined', updatedAppointment);
          this.ngOnInit();
        },
        error: (error) => {
          console.error('Failed to update appointment status', error);
        }
      });
    }
  }

  openRescheduleModal(appointmentId: number) {
    // Logic to open reschedule modal
  }

  onSortChange(event: Event): void {
    const sortBy = (event.target as HTMLSelectElement).value;
    this.sortAppointments(sortBy);
  }

  sortAppointments(sortBy: string): void {
    switch (sortBy) {
      case 'date':
        this.sortedAppointments = this.upcomingAppointments.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        break;
      case 'accepted':
        this.sortedAppointments = this.upcomingAppointments.filter(appointment => appointment.status === 'Accepted');
        break;
      case 'declined':
        this.sortedAppointments = this.upcomingAppointments.filter(appointment => appointment.status === 'Declined');
        break;
      case 'pending':
        this.sortedAppointments = this.upcomingAppointments.filter(appointment => appointment.status === 'Pending');
        break;
      default:
        this.sortedAppointments = [...this.upcomingAppointments];
        break;
    }
  }
}
