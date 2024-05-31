import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) {}

  searchUsers(term: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users`, {
      params: new HttpParams().set('term', term)
    });
  }

  searchAppointments(term: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/appointments`, {
      params: new HttpParams().set('term', term)
    });
  }

  searchPatientRecords(term: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/patientrecords`, {
      params: new HttpParams().set('term', term)
    });
  }

  searchTreatments(term: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/treatments`, {
      params: new HttpParams().set('term', term)
    });
  }

  searchSchedules(term: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/schedules`, {
      params: new HttpParams().set('term', term)
    });
  }

  searchBillings(term: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/billings`, {
      params: new HttpParams().set('term', term)
    });
  }
}

