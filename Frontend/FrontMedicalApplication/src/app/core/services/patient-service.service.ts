import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { PatientRecordDto } from '../dtos/patient.dto';
import { environment } from '../../../environments/environment';
import { UserDto } from '../dtos/user.dto';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly patientEndpoint = `${environment.apiUrl}/patients`;
  private currentPatientSubject: BehaviorSubject<UserDto | null> = new BehaviorSubject<UserDto | null>(null);

  constructor(private http: HttpClient) {}

  getPatientRecords(patientId: number): Observable<PatientRecordDto[]> {
    return this.http.get<PatientRecordDto[]>(`${this.patientEndpoint}/patients/${patientId}/records`);
  }
  

  getPatientRecordById(patientId: number, recordId: number): Observable<PatientRecordDto> {
    return this.http.get<PatientRecordDto>(`${this.patientEndpoint}/${patientId}/records/${recordId}`);
  }

  createPatientRecord(patientRecordDto: PatientRecordDto): Observable<PatientRecordDto> {
    return this.http.post<PatientRecordDto>(`${this.patientEndpoint}/records`, patientRecordDto);
  }

  updatePatientRecord(patientId: number, recordId: number, patientRecordDto: PatientRecordDto): Observable<PatientRecordDto> {
    return this.http.put<PatientRecordDto>(`${this.patientEndpoint}/${patientId}/records/${recordId}`, patientRecordDto);
  }

  deletePatientRecord(patientId: number, recordId: number): Observable<any> {
    return this.http.delete(`${this.patientEndpoint}/${patientId}/records/${recordId}`);
  }
  
  public setCurrentPatient(patient: UserDto): void {
    this.currentPatientSubject.next(patient);
  }

  public getCurrentPatient(): Observable<UserDto | null> {
    return this.currentPatientSubject.asObservable();
  }
}