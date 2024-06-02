import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from './core/services/auth-service.service';
import { ProfileService } from './core/services/profile.service';
import { SearchService } from './core/services/search-service.service';
import { NotificationService } from './core/services/notification-service.service';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let profileService: jasmine.SpyObj<ProfileService>;
  let searchService: jasmine.SpyObj<SearchService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      isLoggedIn: of(true),
      currentUser: of({ name: 'John', surname: 'Doe', roleId: 1, userId: 1 })
    });
    const profileServiceSpy = jasmine.createSpyObj('ProfileService', []);
    const searchServiceSpy = jasmine.createSpyObj('SearchService', ['searchUsers', 'searchAppointments', 'searchPatientRecords', 'searchTreatments', 'searchSchedules', 'searchBillings']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['getUnreadNotificationsCount', 'getNotificationsByUserId']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unrecognized elements and attributes
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    profileService = TestBed.inject(ProfileService) as jasmine.SpyObj<ProfileService>;
    searchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title method', () => {
    expect(typeof component.title).toBe('function');
  });

  it('should render title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, HealthSync');
  });

  it('should initialize isLoggedIn and user information on ngOnInit', () => {
    component.ngOnInit();

    expect(authService.isLoggedIn).toBeTruthy();
    expect(authService.currentUser).toBeTruthy();
    expect(component.isLoggedIn).toBeTrue();
    expect(component.currentUserFullName).toBe('John Doe');
    expect(component.isDoctor).toBeTrue();
  });

  it('should set current user full name and role on setCurrentUserFullName', () => {
    localStorage.setItem('currentUser', JSON.stringify({ name: 'John', surname: 'Doe', roleId: 1, userId: 1 }));
    component.setCurrentUserFullName();

    expect(component.currentUserFullName).toBe('John Doe');
    expect(component.isDoctor).toBeTrue();
    expect(component.isAdmin).toBeFalse();
    expect(component.isPatient).toBeFalse();
  });

  it('should log out and navigate to login on logout', () => {
    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should perform search and handle results on onSearch', () => {
    component.searchTerm = 'test';
    component.selectedEntityType = 'users';
    const searchResults = [{ id: 1, name: 'Test User' }];
    searchService.searchUsers.and.returnValue(of(searchResults));

    component.onSearch();

    expect(searchService.searchUsers).toHaveBeenCalledWith('test');
    expect(component.searchResults).toEqual(searchResults);
    expect(router.navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { term: 'test', entityType: 'users' }
    });
  });

  it('should handle search error', () => {
    component.searchTerm = 'test';
    component.selectedEntityType = 'users';
    const error = new Error('Search failed');
    searchService.searchUsers.and.returnValue(throwError(error));

    spyOn(window, 'alert');
    component.onSearch();

    expect(searchService.searchUsers).toHaveBeenCalledWith('test');
    expect(window.alert).toHaveBeenCalledWith('Search failed: ' + error.message);
  });

  it('should start notification polling for doctors', () => {
    spyOn(component, 'startNotificationPolling');
    authService.currentUser = of({ name: 'John', surname: 'Doe', roleId: 1, userId: 1 }) as any;

    component.ngOnInit();

    expect(component.startNotificationPolling).toHaveBeenCalledWith(1);
  });

  it('should update unread notifications count', () => {
    notificationService.getUnreadNotificationsCount.and.returnValue(of(5));
    component.currentUserId = 1;

    component.updateUnreadCount();

    expect(notificationService.getUnreadNotificationsCount).toHaveBeenCalledWith(1);
    expect(component.unreadNotificationsCount).toBe(5);
  });
});
