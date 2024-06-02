import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, LoginResponse } from './auth-service.service';
import { UserDto } from '../dtos/user.dto';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login a user', () => {
    const mockResponse: LoginResponse = {
      token: 'test-token',
      email: 'test@example.com',
      user: new UserDto('john_doe', 'john.doe@example.com', 1, 'John', 'Doe'),
      roleId: 1,
      isLogged: true
    };

    service.login('test@example.com', 'password').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should request a reset code', () => {
    service.requestResetCode('test@example.com').subscribe(response => {
      expect(response).toEqual('Reset code sent!');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Auth/password-reset/request-code`);
    expect(req.request.method).toBe('POST');
    req.flush('Reset code sent!');
  });

  it('should reset the password', () => {
    service.resetPassword('test@example.com', '12345', 'newPassword').subscribe(response => {
      expect(response).toEqual('Password reset successful');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Auth/reset-password/email`);
    expect(req.request.method).toBe('POST');
    req.flush('Password reset successful');
  });

  it('should sign up a user', () => {
    const mockUser: UserDto = new UserDto('john_doe', 'john.doe@example.com', 1, 'John', 'Doe');

    service.signUp('john_doe', 'john.doe@example.com', 'password', 'password', 'John', 'Doe', '1234567890123', 30, 1, '123 Main St', '555-555-5555').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should verify an email', () => {
    service.verifyEmail('test-token').subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/verify-email?token=test-token`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should get current user role', () => {
    localStorage.setItem('roleId', '1');
    expect(service.getCurrentUserRole()).toEqual(1);
    localStorage.removeItem('roleId');
  });

  it('should logout', () => {
    localStorage.setItem('token', 'test-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
