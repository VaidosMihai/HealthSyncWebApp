import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup-component.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signUp']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error when passwords do not match', () => {
    component.signupForm.setValue({
      username: 'john',
      name: 'John',
      surname: 'Doe',
      CNP: '1234567890123',
      age: 30,
      email: 'john@example.com',
      password: 'Password123!',
      confirmPassword: 'Password1234!',
      Address: '123 Main St',
      PhoneNumber: '1234567890'
    });
    component.onSignup();
    expect(component.signupForm.errors).toEqual({ mismatch: true });
  });

  it('should call signUp on submit when form is valid', () => {
    component.signupForm.setValue({
      username: 'john',
      name: 'John',
      surname: 'Doe',
      CNP: '1234567890123',
      age: 30,
      email: 'john@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      Address: '123 Main St',
      PhoneNumber: '1234567890'
    });
    component.onSignup();
    expect(authService.signUp).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error on signUp', () => {
    spyOn(console, 'error');
    authService.signUp.and.returnValue(throwError('Error signing up'));
    component.signupForm.setValue({
      username: 'john',
      name: 'John',
      surname: 'Doe',
      CNP: '1234567890123',
      age: 30,
      email: 'john@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      Address: '123 Main St',
      PhoneNumber: '1234567890'
    });
    component.onSignup();
    expect(console.error).toHaveBeenCalledWith('Error signing up', 'Error signing up');
  });
});
