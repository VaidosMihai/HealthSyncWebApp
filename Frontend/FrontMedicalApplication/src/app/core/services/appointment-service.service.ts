import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppointmentDto } from '../dtos/appointment.dto';
import { environment } from '../../../environments/environment';
import { MedicalRecordDto } from '../dtos/medical-record.dto';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly appointmentEndpoint = `${environment.apiUrl}/Appointment`;

  constructor(private http: HttpClient) {}

  getAppointmentById(id: number): Observable<AppointmentDto> {
    return this.http.get<AppointmentDto>(`${this.appointmentEndpoint}/${id}`);
  }

  createAppointment(appointment: AppointmentDto): Observable<AppointmentDto> {
    return this.http.post<AppointmentDto>(this.appointmentEndpoint, appointment);
  }

  updateAppointment(id: number, appointment: AppointmentDto): Observable<AppointmentDto> {
    return this.http.put<AppointmentDto>(`${this.appointmentEndpoint}/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.appointmentEndpoint}/${id}`);
  }

  getAppointments(): Observable<HttpResponse<AppointmentDto[]>> {
    return this.http.get<AppointmentDto[]>(this.appointmentEndpoint, { observe: 'response' });
  }

  getAppointmentsByDoctor(doctorId: number): Observable<AppointmentDto[]> {
    return this.http.get<AppointmentDto[]>(`${this.appointmentEndpoint}/by-doctor/${doctorId}`, { observe: 'body' });
  }

  getAppointmentsByPatient(patientId: number): Observable<AppointmentDto[]> {
    return this.http.get<AppointmentDto[]>(`${this.appointmentEndpoint}/by-patient/${patientId}`, { observe: 'body' });
  }

  addPatientRecordToAppointment(appointmentId: number, record: MedicalRecordDto): Observable<any> {
    return this.http.post(`${this.appointmentEndpoint}/${appointmentId}/addPatientRecord`, record);
  }

  notifyDoctor(doctorId: number): Observable<any> {
    return this.http.post(`${this.appointmentEndpoint}/notify-doctor/${doctorId}`, {});
  }

  acceptAppointment(appointmentId: number): Observable<any> {
    return this.http.put(`${this.appointmentEndpoint}/${appointmentId}/accept`, {});
  }

  declineAppointment(appointmentId: number): Observable<any> {
    return this.http.put(`${this.appointmentEndpoint}/${appointmentId}/decline`, {});
  }

  rescheduleAppointment(appointmentId: number, newDateTime: Date): Observable<any> {
    return this.http.put(`${this.appointmentEndpoint}/${appointmentId}/reschedule`, newDateTime);
  }

  notifyUser(userId: number, message: string): Observable<any> {
    return this.http.post(`${this.appointmentEndpoint}/notify-user`, { userId, message });
  }
}
