import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AppointmentListComponent } from './appointment-list.component';
import { AppointmentService } from '../../../services/appointment-service.service';
import { UserService } from '../../../services/user-service.service';
import { NotificationService } from '../../../services/notification-service.service'; // Import NotificationService
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { AppointmentDto } from '../../../dtos/appointment.dto';

describe('AppointmentListComponent', () => {
  let component: AppointmentListComponent;
  let fixture: ComponentFixture<AppointmentListComponent>;
  let appointmentService: jasmine.SpyObj<AppointmentService>;
  let userService: jasmine.SpyObj<UserService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const appointmentServiceSpy = jasmine.createSpyObj('AppointmentService', ['getAppointments', 'deleteAppointment']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserById']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['createNotification']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AppointmentListComponent],
      providers: [
        { provide: AppointmentService, useValue: appointmentServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    appointmentService = TestBed.inject(AppointmentService) as jasmine.SpyObj<AppointmentService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(AppointmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load appointments on init', () => {
    const appointments: AppointmentDto[] = [{ appointmentId: 1, patientId: 1, doctorId: 1, dateTime: new Date(), status: 'Pending', patientRecordId: 1 }];
    appointmentService.getAppointments.and.returnValue(of(new HttpResponse({ body: appointments })));

    component.ngOnInit();

    expect(component.appointments).toEqual(appointments);
  });

  it('should handle error while loading appointments', () => {
    spyOn(console, 'error');
    appointmentService.getAppointments.and.returnValue(throwError('Error fetching appointments'));

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching appointments', 'Error fetching appointments');
  });

  it('should delete appointment', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    appointmentService.deleteAppointment.and.returnValue(of({}));
    component.appointments = [{ appointmentId: 1, patientId: 1, doctorId: 1, dateTime: new Date(), status: 'Pending', patientRecordId: 1 }];

    component.deleteAppointment(1);

    expect(appointmentService.deleteAppointment).toHaveBeenCalledWith(1);
  });

  it('should handle error while deleting appointment', () => {
    spyOn(console, 'error');
    spyOn(window, 'confirm').and.returnValue(true);
    appointmentService.deleteAppointment.and.returnValue(throwError('Error deleting appointment'));
    component.appointments = [{ appointmentId: 1, patientId: 1, doctorId: 1, dateTime: new Date(), status: 'Pending', patientRecordId: 1 }];

    component.deleteAppointment(1);

    expect(console.error).toHaveBeenCalledWith('Error deleting appointment with id 1', 'Error deleting appointment');
  });
});
