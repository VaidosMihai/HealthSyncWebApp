export interface NotificationDto {
  notificationId?: number;
  userId: number;
  message: string;
  createdAt: Date;
  isRead: boolean;
}
