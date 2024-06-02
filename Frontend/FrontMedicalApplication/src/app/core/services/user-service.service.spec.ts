import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user-service.service';
import { UserDto } from '../dtos/user.dto';
import { environment } from '../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the current user', () => {
    const user: UserDto = new UserDto('john_doe', 'john.doe@example.com', 2, 'John', 'Doe');
    service.setCurrentUser(user);
    service.currentUser.subscribe(currentUser => {
      expect(currentUser).toEqual(user);
    });
  });

  it('should get a patient by ID', () => {
    const mockUser: UserDto = new UserDto('john_doe', 'john.doe@example.com', 2, 'John', 'Doe');
    service.getPatientById(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/user/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should create a patient', () => {
    const mockUser: UserDto = new UserDto('john_doe', 'john.doe@example.com', 2, 'John', 'Doe');
    service.createPatient(mockUser).subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne(environment.apiUrl + '/user');
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should delete a patient', () => {
    service.deletePatient(1).subscribe(response => {
      expect(response).toEqual({});
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/user/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get all users', () => {
    const mockUsers: UserDto[] = [new UserDto('john_doe', 'john.doe@example.com', 2, 'John', 'Doe')];
    service.getAllUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });
    const req = httpMock.expectOne(environment.apiUrl + '/user');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should get all users with a specific role ID', () => {
    const mockUsers: UserDto[] = [new UserDto('john_doe', 'john.doe@example.com', 2, 'John', 'Doe')];
    service.getAllUsersWithRoleId(2).subscribe(users => {
      expect(users).toEqual(mockUsers);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/user?roleId=2`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should get users by role', () => {
    const mockUsers: UserDto[] = [new UserDto('john_doe', 'john.doe@example.com', 2, 'John', 'Doe')];
    service.getUsersByRole(2).subscribe(users => {
      expect(users).toEqual(mockUsers);
    });
    const req = httpMock.expectOne(environment.apiUrl + '/user');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should get user data by email', () => {
    const mockUser: UserDto = new UserDto('john_doe', 'john.doe@example.com', 2, 'John', 'Doe');
    service.getUserDataByEmail('john.doe@example.com').subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/user/email/john.doe@example.com`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should get user by username', () => {
    const mockUser: UserDto = new UserDto('john_doe', 'john.doe@example.com', 2, 'John', 'Doe');
    service.getUserByUsername('john_doe').subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/user/by-username/john_doe`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should get user by ID', () => {
    const mockUser: UserDto = new UserDto('john_doe', 'john.doe@example.com', 2, 'John', 'Doe');
    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/user/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should get notification count', () => {
    service.getNotificationCount(1).subscribe(count => {
      expect(count).toEqual(5);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/user/notifications/count/1`);
    expect(req.request.method).toBe('GET');
    req.flush(5);
  });

  it('should get notifications', () => {
    const mockNotifications = [{ notificationId: 1, userId: 1, message: 'Test', createdAt: new Date(), isRead: false }];
    service.getNotifications(1).subscribe(notifications => {
      expect(notifications).toEqual(mockNotifications);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/user/notifications/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockNotifications);
  });

  it('should update a patient', () => {
    const mockUser: UserDto = new UserDto('john_doe', 'john.doe@example.com', 2, 'John', 'Doe');
    service.updatePatient(1, mockUser).subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/user/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockUser);
  });

  it('should update a patient description', () => {
    const mockUser: UserDto = new UserDto('john_doe', 'john.doe@example.com', 2, 'John', 'Doe');
    service.updateDescription(1, 'New Description').subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/user/1/description`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockUser);
  });
});
