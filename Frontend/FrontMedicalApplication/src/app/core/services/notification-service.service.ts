import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notification`;

  constructor(private http: HttpClient) {}

  getUnreadNotificationsCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count/${userId}`);
  }

  getNotificationsByUserId(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}`);
  }

  sendEmail(to: string, subject: string, body: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/contact`, { to, subject, body });
  }

  sendSms(to: string, message: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/send-sms`, { to, message });
  }
}
