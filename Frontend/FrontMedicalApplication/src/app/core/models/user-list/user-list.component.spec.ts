import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router';
import { UserDto } from '../../dtos/user.dto';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getAllUsers', 'deletePatient']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ UserListComponent ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on init', () => {
    const users: UserDto[] = [new UserDto('user1', 'user1@example.com', 2, 'User', 'One')];
    userService.getAllUsers.and.returnValue(of(users));

    component.ngOnInit();

    expect(component.users).toEqual(users);
    expect(userService.getAllUsers).toHaveBeenCalled();
  });

  it('should handle error while fetching users', () => {
    const error = 'Error fetching users';
    userService.getAllUsers.and.returnValue(throwError(error));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(component.users).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error fetching users:', error);
  });

  it('should delete user and refresh the list', () => {
    const userId = 1;
    userService.deletePatient.and.returnValue(of({}));
    spyOn(component, 'fetchUsers');

    component.deleteUser(userId);

    expect(userService.deletePatient).toHaveBeenCalledWith(userId);
    expect(component.fetchUsers).toHaveBeenCalled();
  });

  it('should handle error while deleting user', () => {
    const error = 'Failed to delete user';
    userService.deletePatient.and.returnValue(throwError(error));
    spyOn(console, 'error');

    component.deleteUser(1);

    expect(console.error).toHaveBeenCalledWith('Failed to delete user:', error);
  });

  it('should confirm before deleting user', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'deleteUser');

    component.confirmDeleteUser(1);

    expect(window.confirm).toHaveBeenCalled();
    expect(component.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should navigate to add user', () => {
    component.addUser();

    expect(router.navigate).toHaveBeenCalledWith(['/user/add']);
  });

  it('should navigate to edit user', () => {
    component.editUser(1);

    expect(router.navigate).toHaveBeenCalledWith(['/user/edit', 1]);
  });
});
