import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { VerifyEmailComponent } from './verify-email.component';
import { AuthService } from '../../services/auth-service.service';

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['verifyEmail']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ VerifyEmailComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: jasmine.createSpy('get').and.returnValue('test-token')
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify email and show success message', () => {
    authService.verifyEmail.and.returnValue(of({}));

    component.ngOnInit();

    expect(component.message).toBe('Email verified successfully. You can now login.');
    expect(authService.verifyEmail).toHaveBeenCalledWith('test-token');
    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    }, 3000);
  });

  it('should show error message if token is invalid', () => {
    authService.verifyEmail.and.returnValue(throwError('Invalid token'));

    component.ngOnInit();

    expect(component.error).toBe('Invalid or expired token.');
    expect(authService.verifyEmail).toHaveBeenCalledWith('test-token');
  });

  it('should show error message if no token provided', () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        snapshot: {
          queryParamMap: {
            get: jasmine.createSpy('get').and.returnValue(null)
          }
        }
      }
    });

    component.ngOnInit();

    expect(component.error).toBe('No token provided.');
  });
});
