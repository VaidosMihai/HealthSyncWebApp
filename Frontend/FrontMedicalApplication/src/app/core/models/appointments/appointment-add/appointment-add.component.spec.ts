import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AppointmentAddComponent } from './appointment-add.component';
import { AppointmentService } from '../../../services/appointment-service.service';
import { UserService } from '../../../services/user-service.service';
import { AuthService } from '../../../services/auth-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserDto } from '../../../dtos/user.dto';
import { AppointmentDto } from '../../../dtos/appointment.dto';

describe('AppointmentAddComponent', () => {
  let component: AppointmentAddComponent;
  let fixture: ComponentFixture<AppointmentAddComponent>;
  let appointmentService: jasmine.SpyObj<AppointmentService>;
  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  beforeEach(async () => {
    const appointmentServiceSpy = jasmine.createSpyObj('AppointmentService', ['createAppointment', 'notifyDoctor']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserByUsername', 'getUsersByRole']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserDataByEmail']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = { queryParams: of({ doctorUsername: 'doctor1', patientUsername: 'patient1' }) };

    await TestBed.configureTestingModule({
      declarations: [AppointmentAddComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AppointmentService, useValue: appointmentServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();

    appointmentService = TestBed.inject(AppointmentService) as jasmine.SpyObj<AppointmentService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(AppointmentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error while loading doctor and patient data', () => {
    spyOn(console, 'error');
    userService.getUserByUsername.and.returnValue(throwError('Error fetching user'));
    component.ngOnInit();
    expect(console.error).toHaveBeenCalledWith('Error fetching user');
  });

  it('should create new appointment on submit', () => {
    const newAppointment: AppointmentDto = { appointmentId: 1, patientId: 1, doctorId: 1, dateTime: new Date('2023-06-01T10:00:00'), status: 'Pending', reason: '' };
    component.appointmentForm.setValue({ doctorId: 1, patientId: 1, doctorUsername: 'doctor1', patientUsername: 'patient1', date: '2023-06-01T10:00:00', reason: '' });
    appointmentService.createAppointment.and.returnValue(of(newAppointment));
    component.onSubmit();
    expect(appointmentService.createAppointment).toHaveBeenCalledWith(newAppointment);
    expect(router.navigate).toHaveBeenCalledWith(['/appointment']);
  });

  it('should handle error while creating new appointment', () => {
    spyOn(console, 'error');
    component.appointmentForm.setValue({ doctorId: 1, patientId: 1, doctorUsername: 'doctor1', patientUsername: 'patient1', date: '2023-06-01T10:00:00', reason: '' });
    appointmentService.createAppointment.and.returnValue(throwError('Error creating new appointment'));
    component.onSubmit();
    expect(console.error).toHaveBeenCalledWith('Error creating new appointment', 'Error creating new appointment');
  });
});
