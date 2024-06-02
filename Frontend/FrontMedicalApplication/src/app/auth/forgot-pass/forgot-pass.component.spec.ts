import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPassComponent } from './forgot-pass.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ForgotPassComponent', () => {
  let component: ForgotPassComponent;
  let fixture: ComponentFixture<ForgotPassComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['requestResetCode']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ForgotPassComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(ForgotPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send reset code', () => {
    authService.requestResetCode.and.returnValue(of({}));
    component.forgotPasswordForm.setValue({ email: 'john@example.com' });
    component.onRequestCode();
    expect(authService.requestResetCode).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/reset-password']);
  });

  it('should handle error while sending reset code', () => {
    spyOn(console, 'error');
    authService.requestResetCode.and.returnValue(throwError('Error sending reset code'));
    component.forgotPasswordForm.setValue({ email: 'john@example.com' });
    component.onRequestCode();
    expect(console.error).toHaveBeenCalledWith('Error sending reset code', 'Error sending reset code');
  });
});
