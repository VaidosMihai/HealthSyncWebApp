import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalRecordDto } from '../../../dtos/medical-record.dto';
import { AppointmentService } from '../../../services/appointment-service.service';
import { AppointmentDto } from '../../../dtos/appointment.dto';
import { NotificationDto } from '../../../dtos/notification.dto';
import { NotificationService } from '../../../services/notification-service.service';

@Component({
  selector: 'app-medical-record-new',
  templateUrl: './medical-record-new.component.html',
  styleUrls: ['./medical-record-new.component.css']
})
export class MedicalRecordNewComponent implements OnInit {
  medicalRecord: MedicalRecordDto = new MedicalRecordDto(0, 0, new Date(), '', '');
  appointmentId!: number;

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.appointmentId = parseInt(this.route.snapshot.paramMap.get('appointmentId')!, 10);
  }

  sendNotification(userId: number, message: string): void {
    const notification: NotificationDto = {
      notificationId: 0,
      userId,
      message,
      createdAt: new Date(),
      isRead: false
    };

    this.notificationService.createNotification(notification).subscribe({
      next: (createdNotification) => {
        console.log('Notification sent', createdNotification);
      },
      error: (error) => {
        console.error('Failed to send notification', error);
      }
    });
  }

  onSubmit(): void {
    this.appointmentService.addPatientRecordToAppointment(this.appointmentId, this.medicalRecord)
      .subscribe({
        next: () => {
          
        },
        error: (error) => {
          this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
            next: (appointment: AppointmentDto) => {
              const patientId = appointment.patientId;
              this.sendNotification(patientId, 'A new medical diagnosis has been added to your appointment.');
              alert('Medical record added successfully');
              this.router.navigate(['/appointment']);
            },
            error: (error) => {
              console.error('Error fetching appointment:', error);
              alert('Failed to add medical record and fetch appointment details');
            }
          });
        }
      });
  }
}
