export interface NotificationDto {
    notificationId: number;
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    userId: number; // Assuming each notification is associated with a user
  }
