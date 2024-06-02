import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AppointmentEditComponent } from './appointment-edit.component';
import { AppointmentService } from '../../../services/appointment-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentDto } from '../../../dtos/appointment.dto';
import { ReactiveFormsModule } from '@angular/forms';

describe('AppointmentEditComponent', () => {
  let component: AppointmentEditComponent;
  let fixture: ComponentFixture<AppointmentEditComponent>;
  let appointmentService: jasmine.SpyObj<AppointmentService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  beforeEach(async () => {
    const appointmentServiceSpy = jasmine.createSpyObj('AppointmentService', ['getAppointmentById', 'updateAppointment', 'createAppointment']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = { snapshot: { params: { id: 1 } } };

    await TestBed.configureTestingModule({
      declarations: [AppointmentEditComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AppointmentService, useValue: appointmentServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();

    appointmentService = TestBed.inject(AppointmentService) as jasmine.SpyObj<AppointmentService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(AppointmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with appointment data in edit mode', () => {
    const appointment: AppointmentDto = { appointmentId: 1, patientId: 1, doctorId: 1, dateTime: new Date(), status: 'Pending', reason: '' };
    appointmentService.getAppointmentById.and.returnValue(of(appointment));

    component.ngOnInit();

    expect(component.appointmentForm.value).toEqual({ doctorId: 1, patientId: 1, dateTime: appointment.dateTime.toISOString(), reason: '', status: 'Pending' });
  });

  it('should handle error while loading appointment data', () => {
    spyOn(console, 'error');
    appointmentService.getAppointmentById.and.returnValue(throwError('Error fetching appointment'));

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching appointment', 'Error fetching appointment');
  });

  it('should update appointment on submit in edit mode', () => {
    const updatedAppointment: AppointmentDto = { appointmentId: 1, patientId: 1, doctorId: 1, dateTime: new Date(), status: 'Pending', reason: '' };
    component.isEditMode = true;
    component.appointmentId = 1;
    component.appointmentForm.setValue({ doctorId: 1, patientId: 1, dateTime: updatedAppointment.dateTime.toISOString(), reason: '', status: 'Pending' });
    appointmentService.updateAppointment.and.returnValue(of(updatedAppointment));

    component.onSubmit();

    expect(appointmentService.updateAppointment).toHaveBeenCalledWith(1, updatedAppointment);
    expect(router.navigate).toHaveBeenCalledWith(['/appointment']);
  });

  it('should handle error while updating appointment', () => {
    spyOn(console, 'error');
    component.isEditMode = true;
    component.appointmentId = 1;
    component.appointmentForm.setValue({ doctorId: 1, patientId: 1, dateTime: new Date().toISOString(), reason: '', status: 'Pending' });
    appointmentService.updateAppointment.and.returnValue(throwError('Error updating appointment'));

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Error updating appointment', 'Error updating appointment');
  });

  it('should create new appointment on submit in create mode', () => {
    const newAppointment: AppointmentDto = { appointmentId: 1, patientId: 1, doctorId: 1, dateTime: new Date(), status: 'Pending', reason: '' };
    component.isEditMode = false;
    component.appointmentForm.setValue({ doctorId: 1, patientId: 1, dateTime: newAppointment.dateTime.toISOString(), reason: '', status: 'Pending' });
    appointmentService.createAppointment.and.returnValue(of(newAppointment));

    component.onSubmit();

    expect(appointmentService.createAppointment).toHaveBeenCalledWith(newAppointment);
    expect(router.navigate).toHaveBeenCalledWith(['/appointment']);
  });

  it('should handle error while creating new appointment', () => {
    spyOn(console, 'error');
    component.isEditMode = false;
    component.appointmentForm.setValue({ doctorId: 1, patientId: 1, dateTime: new Date().toISOString(), reason: '', status: 'Pending' });
    appointmentService.createAppointment.and.returnValue(throwError('Error creating new appointment'));

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Error creating new appointment', 'Error creating new appointment');
  });
});
