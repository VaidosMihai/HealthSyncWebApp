import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserDto } from '../dtos/user.dto';

@Injectable({
  providedIn: 'root'
})
export class AdminReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) { }

  getPatientWithMostAppointments(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/patient-most-appointments`).pipe(
      catchError(this.handleError)
    );
  }

  getDoctorWithMostReviews(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/doctor-most-reviews`).pipe(
      catchError(this.handleError)
    );
  }

  getOldestPatient(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/oldest-patient`).pipe(
      catchError(this.handleError)
    );
  }

  getYoungestPatient(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/youngest-patient`).pipe(
      catchError(this.handleError)
    );
  }

  getOldestDoctor(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/oldest-doctor`).pipe(
      catchError(this.handleError)
    );
  }

  getYoungestDoctor(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/youngest-doctor`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
