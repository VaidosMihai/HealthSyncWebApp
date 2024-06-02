import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { PatientListComponent } from './patient-record-list.component';
import { UserService } from '../../../services/user-service.service';
import { AppointmentService } from '../../../services/appointment-service.service';
import { UserDto } from '../../../dtos/user.dto';
import { AppointmentDto } from '../../../dtos/appointment.dto';

describe('PatientRecordListComponent', () => {
  let component: PatientListComponent;
  let fixture: ComponentFixture<PatientListComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let appointmentService: jasmine.SpyObj<AppointmentService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getAllUsersWithRoleId']);
    const appointmentServiceSpy = jasmine.createSpyObj('AppointmentService', ['getAppointmentsByDoctor', 'getAppointments']);

    await TestBed.configureTestingModule({
      declarations: [ PatientListComponent ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: AppointmentService, useValue: appointmentServiceSpy }
      ]
    })
    .compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    appointmentService = TestBed.inject(AppointmentService) as jasmine.SpyObj<AppointmentService>;

    fixture = TestBed.createComponent(PatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load patients for admin on init', () => {
    spyOn(component, 'getCurrentUserRoleIdFromLocalStorage').and.returnValue(3);
    const patients: UserDto[] = [new UserDto('user1', 'user1@example.com', 2, 'User', 'One')];
    const appointments: AppointmentDto[] = [new AppointmentDto(1, 1, new Date(), 'Checkup')];
    userService.getAllUsersWithRoleId.and.returnValue(of(patients));
    appointmentService.getAppointments.and.returnValue(of(new HttpResponse({ body: appointments, status: 200 })));

    component.ngOnInit();

    expect(component.patients).toEqual(patients);
    expect(component.patientAppointments).toEqual(appointments);
    expect(userService.getAllUsersWithRoleId).toHaveBeenCalledWith(2);
    expect(appointmentService.getAppointments).toHaveBeenCalled();
  });

  it('should load patients for doctor on init', () => {
    spyOn(component, 'getCurrentUserIdFromLocalStorage').and.returnValue(1);
    const patients: UserDto[] = [new UserDto('user1', 'user1@example.com', 2, 'User', 'One')];
    const appointments: AppointmentDto[] = [new AppointmentDto(1, 1, new Date(), 'Checkup')];
    userService.getAllUsersWithRoleId.and.returnValue(of(patients));
    appointmentService.getAppointmentsByDoctor.and.returnValue(of(new HttpResponse({ body: appointments, status: 200 })));

    component.ngOnInit();

    expect(component.patients).toEqual(patients);
    expect(component.patientAppointments).toEqual(appointments);
    expect(userService.getAllUsersWithRoleId).toHaveBeenCalledWith(2);
    expect(appointmentService.getAppointmentsByDoctor).toHaveBeenCalledWith(1);
  });

  it('should handle error while fetching patients', () => {
    const error = 'Error fetching patients';
    userService.getAllUsersWithRoleId.and.returnValue(throwError(error));
    spyOn(console, 'error');

    component.loadPatients();

    expect(console.error).toHaveBeenCalledWith('There was an error fetching the patients', error);
  });

  it('should handle error while fetching appointments', () => {
    const error = 'Error fetching appointments';
    appointmentService.getAppointmentsByDoctor.and.returnValue(throwError(error));
    spyOn(console, 'error');

    component.loadAppointments();

    expect(console.error).toHaveBeenCalledWith('Error fetching appointments', error);
  });

  it('should filter patients by doctor appointments', () => {
    const patients: UserDto[] = [new UserDto('user1', 'user1@example.com', 2, 'User', 'One')];
    const appointments: AppointmentDto[] = [new AppointmentDto(1, 1, new Date(), 'Checkup')];
    component.patients = patients;
    component.patientAppointments = appointments;

    component.filterPatientsByDoctorAppointments();

    expect(component.patients.length).toBe(1);
  });

  it('should get next appointment for patient', () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 100000);
    const pastDate = new Date(now.getTime() - 100000);
    const appointments: AppointmentDto[] = [
      new AppointmentDto(1, 1, futureDate, 'Future Checkup'),
      new AppointmentDto(1, 1, pastDate, 'Past Checkup')
    ];
    component.patientAppointments = appointments;

    const nextAppointment = component.getNextAppointment(1);

    expect(nextAppointment).toEqual(new AppointmentDto(1, 1, futureDate, 'Future Checkup'));
  });
});
