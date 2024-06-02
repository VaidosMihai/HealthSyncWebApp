import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SearchService } from './search-service.service';
import { environment } from '../../../environments/environment';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchService]
    });
    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search users', () => {
    const mockResponse = [{ id: 1, name: 'John Doe' }];
    const term = 'john';

    service.searchUsers(term).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/search/users?term=john`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should search appointments', () => {
    const mockResponse = [{ id: 1, reason: 'Checkup' }];
    const term = 'checkup';

    service.searchAppointments(term).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/search/appointments?term=checkup`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should search patient records', () => {
    const mockResponse = [{ id: 1, diagnosis: 'Flu' }];
    const term = 'flu';

    service.searchPatientRecords(term).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/search/patientrecords?term=flu`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should search treatments', () => {
    const mockResponse = [{ id: 1, treatment: 'Physical Therapy' }];
    const term = 'therapy';

    service.searchTreatments(term).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/search/treatments?term=therapy`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should search schedules', () => {
    const mockResponse = [{ id: 1, schedule: 'Monday 10 AM' }];
    const term = 'monday';

    service.searchSchedules(term).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/search/schedules?term=monday`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should search billings', () => {
    const mockResponse = [{ id: 1, billing: 'Invoice 123' }];
    const term = 'invoice';

    service.searchBillings(term).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/search/billings?term=invoice`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
