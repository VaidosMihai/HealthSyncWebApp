import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminReportService } from './report.service';
import { UserDto } from '../dtos/user.dto';
import { environment } from '../../../environments/environment';

describe('AdminReportService', () => {
  let service: AdminReportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminReportService]
    });
    service = TestBed.inject(AdminReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get patient with most appointments', () => {
    const mockUser: UserDto = new UserDto('john_doe', 'john.doe@example.com', 2, 'John', 'Doe');

    service.getPatientWithMostAppointments().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reports/patient-most-appointments`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should get doctor with most reviews', () => {
    const mockUser: UserDto = new UserDto('john_doe', 'john.doe@example.com', 1, 'John', 'Doe');

    service.getDoctorWithMostReviews().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reports/doctor-most-reviews`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should get the oldest patient', () => {
    const mockUser: UserDto = new UserDto('john_doe', 'john.doe@example.com', 2, 'John', 'Doe');

    service.getOldestPatient().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reports/oldest-patient`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should get the youngest patient', () => {
    const mockUser: UserDto = new UserDto('john_doe', 'john.doe@example.com', 2, 'John', 'Doe');

    service.getYoungestPatient().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reports/youngest-patient`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should get the oldest doctor', () => {
    const mockUser: UserDto = new UserDto('john_doe', 'john.doe@example.com', 1, 'John', 'Doe');

    service.getOldestDoctor().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reports/oldest-doctor`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should get the youngest doctor', () => {
    const mockUser: UserDto = new UserDto('john_doe', 'john.doe@example.com', 1, 'John', 'Doe');

    service.getYoungestDoctor().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/reports/youngest-doctor`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
