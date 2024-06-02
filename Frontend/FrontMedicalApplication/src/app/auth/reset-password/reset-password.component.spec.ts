import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset password', () => {
    authService.resetPassword.and.returnValue(of({}));
    component.resetPasswordForm.setValue({
      email: 'john@example.com',
      code: '123456',
      newPassword: 'Password123!',
      confirmPassword: 'Password123!'
    });
    component.onReset();
    expect(authService.resetPassword).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error while resetting password', () => {
    spyOn(console, 'error');
    authService.resetPassword.and.returnValue(throwError('Error resetting password'));
    component.resetPasswordForm.setValue({
      email: 'john@example.com',
      code: '123456',
      newPassword: 'Password123!',
      confirmPassword: 'Password123!'
    });
    component.onReset();
    expect(console.error).toHaveBeenCalledWith('Error resetting password', 'Error resetting password');
  });
});
