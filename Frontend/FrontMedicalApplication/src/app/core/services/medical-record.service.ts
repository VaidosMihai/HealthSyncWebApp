import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MedicalRecordDto } from '../dtos/medical-record.dto';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private apiUrl = `${environment.apiUrl}/PatientRecord`; // Updated endpoint

  constructor(private http: HttpClient) { }

  getMedicalRecords(): Observable<MedicalRecordDto[]> {
    return this.http.get<MedicalRecordDto[]>(this.apiUrl);
  }

  getMedicalRecordById(id: number): Observable<MedicalRecordDto> {
    return this.http.get<MedicalRecordDto>(`${this.apiUrl}/${id}`);
  }

  getMedicalRecordByAppointmentId(appointmentId: number): Observable<MedicalRecordDto> {
    return this.http.get<MedicalRecordDto>(`${this.apiUrl}/by-appointment/${appointmentId}`);
  }

  createMedicalRecord(medicalRecord: MedicalRecordDto): Observable<MedicalRecordDto> {
    return this.http.post<MedicalRecordDto>(this.apiUrl, medicalRecord);
  }

  updateMedicalRecord(id: number, medicalRecord: MedicalRecordDto): Observable<MedicalRecordDto> {
    return this.http.put<MedicalRecordDto>(`${this.apiUrl}/${id}`, medicalRecord);
  }
}
