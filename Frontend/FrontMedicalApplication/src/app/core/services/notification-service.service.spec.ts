import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification-service.service';
import { NotificationDto } from '../dtos/notification.dto';
import { environment } from '../../../environments/environment';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get unread notifications count', () => {
    const userId = 1;
    const mockCount = 5;

    service.getUnreadNotificationsCount(userId).subscribe(count => {
      expect(count).toBe(mockCount);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/notification/unread-count/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCount);
  });

  it('should get notifications by user ID', () => {
    const mockNotifications: NotificationDto[] = [{ notificationId: 1, userId: 1, message: 'Test', createdAt: new Date(), isRead: false }];

    service.getNotificationsByUserId(1).subscribe(notifications => {
      expect(notifications).toEqual(mockNotifications);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/notification/user/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockNotifications);
  });

  it('should create a notification', () => {
    const mockNotification: NotificationDto = { notificationId: 1, userId: 1, message: 'Test', createdAt: new Date(), isRead: false };

    service.createNotification(mockNotification).subscribe(response => {
      expect(response).toEqual();
    });

    const req = httpMock.expectOne(environment.apiUrl + '/notification');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should mark a notification as read', () => {
    service.markAsRead(1).subscribe(response => {
      expect(response).toEqual();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/notification/1/mark-as-read`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should mark all notifications as read', () => {
    service.markAllAsRead(1).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/notification/mark-all-as-read/1`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should send an email', () => {
    const mockForm = { name: 'John', email: 'john@example.com', message: 'Hello' };

    service.sendEmail(mockForm).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/contact`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should get contact forms', () => {
    const mockForms = [{ id: 1, name: 'John', email: 'john@example.com', message: 'Hello' }];

    service.getContactForms().subscribe(forms => {
      expect(forms).toEqual(mockForms);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/contact/all`);
    expect(req.request.method).toBe('GET');
    req.flush(mockForms);
  });

  it('should delete a contact form', () => {
    service.deleteContactForm(1).subscribe(response => {
      expect(response).toEqual();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/contact/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
