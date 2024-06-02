import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PatientService } from './patient-service.service';
import { PatientRecordDto } from '../dtos/patient.dto';
import { UserDto } from '../dtos/user.dto';
import { environment } from '../../../environments/environment';

describe('PatientService', () => {
  let service: PatientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientService]
    });
    service = TestBed.inject(PatientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get patient records', () => {
    const mockRecords: PatientRecordDto[] = [new PatientRecordDto(1, new Date(), 'Diagnosis', 'Notes')];

    service.getPatientRecords(1).subscribe(records => {
      expect(records).toEqual(mockRecords);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/patients/patients/1/records`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRecords);
  });

  it('should get patient record by ID', () => {
    const mockRecord: PatientRecordDto = new PatientRecordDto(1, new Date(), 'Diagnosis', 'Notes');

    service.getPatientRecordById(1, 1).subscribe(record => {
      expect(record).toEqual(mockRecord);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/patients/1/records/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRecord);
  });

  it('should create a patient record', () => {
    const mockRecord: PatientRecordDto = new PatientRecordDto(1, new Date(), 'Diagnosis', 'Notes');

    service.createPatientRecord(mockRecord).subscribe(record => {
      expect(record).toEqual(mockRecord);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/patients/records`);
    expect(req.request.method).toBe('POST');
    req.flush(mockRecord);
  });

  it('should update a patient record', () => {
    const mockRecord: PatientRecordDto = new PatientRecordDto(1, new Date(), 'Diagnosis', 'Notes');

    service.updatePatientRecord(1, 1, mockRecord).subscribe(record => {
      expect(record).toEqual(mockRecord);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/patients/1/records/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockRecord);
  });

  it('should delete a patient record', () => {
    service.deletePatientRecord(1, 1).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/patients/1/records/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should set and get the current patient', () => {
    const user: UserDto = new UserDto('john_doe', 'john.doe@example.com', 2, 'John', 'Doe');

    service.setCurrentPatient(user);
    service.getCurrentPatient().subscribe(currentPatient => {
      expect(currentPatient).toEqual(user);
    });
  });
});
