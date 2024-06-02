import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordDto } from '../dtos/medical-record.dto';
import { environment } from '../../../environments/environment';

describe('MedicalRecordService', () => {
  let service: MedicalRecordService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MedicalRecordService]
    });
    service = TestBed.inject(MedicalRecordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get medical records', () => {
    const mockRecords: MedicalRecordDto[] = [new MedicalRecordDto(1, 1, new Date(), 'Diagnosis')];

    service.getMedicalRecords().subscribe(records => {
      expect(records).toEqual(mockRecords);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/PatientRecord`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRecords);
  });

  it('should get medical record by ID', () => {
    const mockRecord: MedicalRecordDto = new MedicalRecordDto(1, 1, new Date(), 'Diagnosis');

    service.getMedicalRecordById(1).subscribe(record => {
      expect(record).toEqual(mockRecord);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/PatientRecord/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRecord);
  });

  it('should get medical record by appointment ID', () => {
    const mockRecord: MedicalRecordDto = new MedicalRecordDto(1, 1, new Date(), 'Diagnosis');

    service.getMedicalRecordByAppointmentId(1).subscribe(record => {
      expect(record).toEqual(mockRecord);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/PatientRecord/by-appointment/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRecord);
  });

  it('should create a medical record', () => {
    const mockRecord: MedicalRecordDto = new MedicalRecordDto(1, 1, new Date(), 'Diagnosis');

    service.createMedicalRecord(mockRecord).subscribe(record => {
      expect(record).toEqual(mockRecord);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/PatientRecord');
    expect(req.request.method).toBe('POST');
    req.flush(mockRecord);
  });

  it('should update a medical record', () => {
    const mockRecord: MedicalRecordDto = new MedicalRecordDto(1, 1, new Date(), 'Diagnosis');

    service.updateMedicalRecord(1, mockRecord).subscribe(record => {
      expect(record).toEqual(mockRecord);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/PatientRecord/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockRecord);
  });
});
