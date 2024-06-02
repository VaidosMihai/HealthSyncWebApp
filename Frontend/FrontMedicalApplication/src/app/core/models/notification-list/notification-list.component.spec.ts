import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationListComponent } from './notification-list.component';
import { NotificationService } from '../../services/notification-service.service';
import { of, throwError } from 'rxjs';
import { NotificationDto } from '../../dtos/notification.dto';

describe('NotificationListComponent', () => {
  let component: NotificationListComponent;
  let fixture: ComponentFixture<NotificationListComponent>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'getNotificationsByUserId',
      'markAsRead',
      'markAllAsRead',
      'createNotification'
    ]);

    await TestBed.configureTestingModule({
      declarations: [NotificationListComponent],
      providers: [
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    fixture = TestBed.createComponent(NotificationListComponent);
    component = fixture.componentInstance;
    component.userId = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load notifications on init', () => {
    const notifications: NotificationDto[] = [{ notificationId: 1, userId: 1, message: 'Test', createdAt: new Date(), isRead: false }];
    notificationService.getNotificationsByUserId.and.returnValue(of(notifications));

    component.ngOnInit();

    expect(component.notifications).toEqual(notifications);
  });

  it('should handle error while loading notifications', () => {
    spyOn(console, 'error');
    notificationService.getNotificationsByUserId.and.returnValue(throwError('Error loading notifications'));

    component.loadNotifications();

    expect(console.error).toHaveBeenCalledWith('Failed to load notifications', 'Error loading notifications');
  });

  it('should mark notification as read', () => {
    const notification: NotificationDto = { notificationId: 1, userId: 1, message: 'Test', createdAt: new Date(), isRead: false };
    notificationService.markAsRead.and.returnValue(of());

    component.markAsRead(notification);

    expect(notificationService.markAsRead).toHaveBeenCalledWith(1);
    expect(notification.isRead).toBeTrue();
    expect(component.notifications.length).toBe(0);
  });

  it('should handle error while marking notification as read', () => {
    spyOn(console, 'error');
    const notification: NotificationDto = { notificationId: 1, userId: 1, message: 'Test', createdAt: new Date(), isRead: false };
    notificationService.markAsRead.and.returnValue(throwError('Error marking as read'));

    component.markAsRead(notification);

    expect(console.error).toHaveBeenCalledWith('Failed to mark notification as read', 'Error marking as read');
  });

  it('should mark all notifications as read', () => {
    const notifications: NotificationDto[] = [{ notificationId: 1, userId: 1, message: 'Test', createdAt: new Date(), isRead: false }];
    component.notifications = notifications;
    notificationService.markAllAsRead.and.returnValue(of());

    component.markAllAsRead();

    expect(notificationService.markAllAsRead).toHaveBeenCalledWith(1);
    expect(component.notifications.length).toBe(0);
    notifications.forEach(notification => expect(notification.isRead).toBeTrue());
  });

  it('should handle error while marking all notifications as read', () => {
    spyOn(console, 'error');
    notificationService.markAllAsRead.and.returnValue(throwError('Error marking all as read'));

    component.markAllAsRead();

    expect(console.error).toHaveBeenCalledWith('Failed to mark all notifications as read', 'Error marking all as read');
  });
});
