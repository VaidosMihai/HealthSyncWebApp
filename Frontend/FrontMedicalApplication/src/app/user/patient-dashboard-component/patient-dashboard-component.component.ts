import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard-component.component.html',
  styleUrls: ['./patient-dashboard-component.component.css']
})
export class PatientDashboardComponent implements OnInit {
  
  // Properties for patient details, appointments, etc.

  url:string = environment.apiUrl + '/PatientRecord'
  constructor(private http: HttpClient) { }

  // Method to fetch billing details
  getPatientData(patientId: string): Observable<any> {
    return this.http.get(this.url);
  }

  ngOnInit(): void {
    // Fetch patient-specific data here
  }

  // Add methods to handle patient-specific actions
}
