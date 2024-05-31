import { TestBed } from '@angular/core/testing';
import { roleGuard } from './role.guard';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('RoleGuard', () => {
  let guard: roleGuard;
  let authServiceMock: any;
  let routerMock: any;
  let routeMock: any;
  let stateMock: any;

  beforeEach(() => {
    authServiceMock = { getCurrentUserRole: jasmine.createSpy('getCurrentUserRole') };
    routerMock = { navigate: jasmine.createSpy('navigate') };
    routeMock = { data: { roles: [1] } };
    stateMock = {}; 

    TestBed.configureTestingModule({
      providers: [
        roleGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(roleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation for correct role', () => {
    authServiceMock.getCurrentUserRole.and.returnValue(1);
    expect(guard.canActivate(routeMock, stateMock)).toBe(true);
  });

  it('should prevent activation for incorrect role', () => {
    authServiceMock.getCurrentUserRole.and.returnValue(2);
    guard.canActivate(routeMock, stateMock);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
  it('should block access when currentUserRole is null', () => {
    authServiceMock.getCurrentUserRole.and.returnValue(null);
    expect(guard.canActivate(routeMock, stateMock)).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
