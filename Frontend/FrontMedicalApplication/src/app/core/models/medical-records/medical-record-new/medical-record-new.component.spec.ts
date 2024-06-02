import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalRecordNewComponent } from './medical-record-new.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../../services/appointment-service.service';
import { NotificationService } from '../../../services/notification-service.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MedicalRecordNewComponent', () => {
  let component: MedicalRecordNewComponent;
  let fixture: ComponentFixture<MedicalRecordNewComponent>;
  let appointmentService: jasmine.SpyObj<AppointmentService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const appointmentServiceSpy = jasmine.createSpyObj('AppointmentService', ['addPatientRecordToAppointment', 'getAppointmentById']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['createNotification']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [MedicalRecordNewComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AppointmentService, useValue: appointmentServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    appointmentService = TestBed.inject(AppointmentService) as jasmine.SpyObj<AppointmentService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(MedicalRecordNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send notification', () => {
    const notification = { notificationId: 0, userId: 1, message: 'Test message', createdAt: new Date(), isRead: false };
    notificationService.createNotification.and.returnValue(of());

    component.sendNotification(1, 'Test message');

    expect(notificationService.createNotification).toHaveBeenCalledWith(jasmine.objectContaining(notification));
  });

  it('should add medical record on submit', () => {
    appointmentService.addPatientRecordToAppointment.and.returnValue(of({}));
    appointmentService.getAppointmentById.and.returnValue(of({
      appointmentId: 1,
      patientId: 1,
      doctorId: 1,
      dateTime: new Date(),
      reason: 'Test',
      status: 'Pending'
    }));

    component.onSubmit();

    expect(appointmentService.addPatientRecordToAppointment).toHaveBeenCalled();
  });

  it('should handle error when adding medical record', () => {
    appointmentService.addPatientRecordToAppointment.and.returnValue(throwError('Error adding medical record'));
    appointmentService.getAppointmentById.and.returnValue(of({
      appointmentId: 1,
      patientId: 1,
      doctorId: 1,
      dateTime: new Date(),
      reason: 'Test',
      status: 'Pending'
    }));
    spyOn(window, 'alert');

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Failed to add medical record and fetch appointment details');
  });
});
