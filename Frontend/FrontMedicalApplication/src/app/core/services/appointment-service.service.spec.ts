import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppointmentService } from './appointment-service.service';
import { AppointmentDto } from '../dtos/appointment.dto';
import { environment } from '../../../environments/environment';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppointmentService]
    });
    service = TestBed.inject(AppointmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get appointment by ID', () => {
    const mockAppointment: AppointmentDto = new AppointmentDto(1, 1, new Date(), 'Checkup');

    service.getAppointmentById(1).subscribe(appointment => {
      expect(appointment).toEqual(mockAppointment);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Appointment/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAppointment);
  });

  it('should create an appointment', () => {
    const mockAppointment: AppointmentDto = new AppointmentDto(1, 1, new Date(), 'Checkup');

    service.createAppointment(mockAppointment).subscribe(appointment => {
      expect(appointment).toEqual(mockAppointment);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/Appointment');
    expect(req.request.method).toBe('POST');
    req.flush(mockAppointment);
  });

  it('should update an appointment', () => {
    const mockAppointment: AppointmentDto = new AppointmentDto(1, 1, new Date(), 'Checkup');

    service.updateAppointment(1, mockAppointment).subscribe(appointment => {
      expect(appointment).toEqual(mockAppointment);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Appointment/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockAppointment);
  });

  it('should delete an appointment', () => {
    service.deleteAppointment(1).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Appointment/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get appointments', () => {
    const mockAppointments: AppointmentDto[] = [new AppointmentDto(1, 1, new Date(), 'Checkup')];

    service.getAppointments().subscribe(response => {
      expect(response.body).toEqual(mockAppointments);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/Appointment');
    expect(req.request.method).toBe('GET');
    req.flush(mockAppointments, { headers: {}, status: 200, statusText: 'OK' });
  });

  it('should get appointments by doctor ID', () => {
    const mockAppointments: AppointmentDto[] = [new AppointmentDto(1, 1, new Date(), 'Checkup')];

    service.getAppointmentsByDoctor(1).subscribe(response => {
      expect(response.body).toEqual(mockAppointments);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Appointment/by-doctor/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAppointments, { headers: {}, status: 200, statusText: 'OK' });
  });

  it('should get appointments by patient ID', () => {
    const mockAppointments: AppointmentDto[] = [new AppointmentDto(1, 1, new Date(), 'Checkup')];

    service.getAppointmentsByPatient(1).subscribe(appointments => {
      expect(appointments).toEqual(mockAppointments);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Appointment/by-patient/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAppointments);
  });

  it('should add patient record to appointment', () => {
    const mockRecord = { appointmentId: 1, patientId: 1, dateRecorded: new Date(), diagnosis: 'Diagnosis', notes: 'Notes' };

    service.addPatientRecordToAppointment(1, mockRecord).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Appointment/1/addPatientRecord`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should notify doctor', () => {
    service.notifyDoctor(1).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Appointment/notify-doctor/1`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should accept appointment', () => {
    service.acceptAppointment(1).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Appointment/1/accept`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should decline appointment', () => {
    service.declineAppointment(1).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Appointment/1/decline`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should reschedule appointment', () => {
    const newDateTime = new Date();

    service.rescheduleAppointment(1, newDateTime).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Appointment/1/reschedule`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should notify user', () => {
    service.notifyUser(1, 'Your appointment has been scheduled.').subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Appointment/notify-user`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
