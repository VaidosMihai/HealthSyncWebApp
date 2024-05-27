import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from '../../services/notification-service.service';
import { NotificationDto } from '../../dtos/notification.dto';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
  @Input() userId!: number; // Use the ! operator to assert that userId will be provided
  @Output() notificationUpdated = new EventEmitter<void>();
  notifications: NotificationDto[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotificationsByUserId(this.userId).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
      error: (error) => {
        console.error('Failed to load notifications', error);
      }
    });
  }

  closeModal(): void {
    // Cast the modal to HTMLElement to access the style property
    const modal = document.querySelector('.notification-modal') as HTMLElement;
    if (modal) {
      modal.style.display = 'none';
    }
  }

  markAsRead(notification: NotificationDto): void {
    // Logic to mark a single notification as read
    if (notification.notificationId !== undefined) {
      this.notificationService.markAsRead(notification.notificationId).subscribe({
        next: () => {
          notification.isRead = true; // Update the local state
          this.notifications = this.notifications.filter(n => n.notificationId !== notification.notificationId); // Remove read notification from list
          this.notificationUpdated.emit(); // Emit event to update unread count
        },
        error: (error) => {
          console.error('Failed to mark notification as read', error);
        }
      });
    } else {
      console.error('Notification ID is undefined');
    }
  }

  markAllAsRead(): void {
    // Logic to mark all notifications as read
    this.notificationService.markAllAsRead(this.userId).subscribe({
      next: () => {
        this.notifications.forEach(notification => notification.isRead = true); // Update the local state
        this.notifications = []; // Clear all notifications from the list
        this.notificationUpdated.emit(); // Emit event to update unread count
      },
      error: (error) => {
        console.error('Failed to mark all notifications as read', error);
      }
    });
  }
}
