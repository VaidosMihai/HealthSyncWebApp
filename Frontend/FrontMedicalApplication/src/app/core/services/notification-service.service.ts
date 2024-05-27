import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationDto } from '../dtos/notification.dto';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notification`;

  constructor(private http: HttpClient) {}

  getUnreadNotificationsCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count/${userId}`);
  }

  getNotificationsByUserId(userId: number): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(`${this.apiUrl}/user/${userId}`).pipe(
      map(notifications => notifications.map(notification => this.toNotificationDto(notification)))
    );
  }

  createNotification(notification: NotificationDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, notification);
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${notificationId}/mark-as-read`, {});
  }
  
  markAllAsRead(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-all-as-read/${userId}`, {});
  }

  private toNotificationDto(notification: any): NotificationDto {
    return {
      notificationId: notification.id,
      userId: notification.userId,
      message: notification.message,
      createdAt: new Date(notification.createdAt),
      isRead: notification.isRead
    };
  }
  
  sendEmail(to: string, subject: string, body: string): Observable<any> {
    const emailPayload = {
      to,
      subject,
      body
    };
    return this.http.post(`$${environment.apiUrl}/contact`, emailPayload);
  }
}
