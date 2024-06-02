import { Component, OnInit } from '@angular/core';
import { AdminReportService } from '../../services/report.service';
import { UserDto } from '../../dtos/user.dto';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {
  patientWithMostAppointments: UserDto | null = null;
  doctorWithMostReviews: UserDto | null = null;
  oldestPatient: UserDto | null = null;
  youngestPatient: UserDto | null = null;
  oldestDoctor: UserDto | null = null;
  youngestDoctor: UserDto | null = null;
  loading = true;
  error: string | null = null;

  constructor(private adminReportService: AdminReportService) { }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.adminReportService.getPatientWithMostAppointments().subscribe(
      data => {
        this.patientWithMostAppointments = data;
        console.log('Patient with Most Appointments Data:', data);
      },
      error => this.handleError(error)
    );

    this.adminReportService.getDoctorWithMostReviews().subscribe(
      data => {
        this.doctorWithMostReviews = data;
        console.log('Doctor with Most Reviews Data:', data);
      },
      error => this.handleError(error)
    );

    this.adminReportService.getOldestPatient().subscribe(
      data => {
        this.oldestPatient = data;
        console.log('Oldest Patient Data:', data);
      },
      error => this.handleError(error)
    );

    this.adminReportService.getYoungestPatient().subscribe(
      data => {
        this.youngestPatient = data;
        console.log('Youngest Patient Data:', data);
      },
      error => this.handleError(error)
    );

    this.adminReportService.getOldestDoctor().subscribe(
      data => {
        this.oldestDoctor = data;
        console.log('Oldest Doctor Data:', data);
      },
      error => this.handleError(error)
    );

    this.adminReportService.getYoungestDoctor().subscribe(
      data => {
        this.youngestDoctor = data;
        console.log('Youngest Doctor Data:', data);
      },
      error => this.handleError(error)
    );
  }

  private handleError(error: any): void {
    this.error = 'An error occurred while loading reports. Please try again later.';
    console.error(error);
  }
}

