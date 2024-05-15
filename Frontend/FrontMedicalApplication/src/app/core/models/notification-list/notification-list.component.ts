import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification-service.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
  @Input() userId!: number; // Use the ! operator to assert that userId will be provided
  notifications: any[] = [];

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
}
