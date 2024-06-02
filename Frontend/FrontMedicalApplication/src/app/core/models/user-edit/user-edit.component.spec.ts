import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserEditComponent } from './user-edit.component';
import { UserService } from '../../services/user-service.service';
import { UserDto } from '../../dtos/user.dto';

describe('UserEditComponent', () => {
  let component: UserEditComponent;
  let fixture: ComponentFixture<UserEditComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getPatientById', 'updatePatient']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ UserEditComponent ],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: 1 }
            }
          }
        }
      ]
    })
    .compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data on init', () => {
    const user: UserDto = new UserDto('user1', 'user1@example.com', 2, 'User', 'One');
    userService.getPatientById.and.returnValue(of(user));

    component.ngOnInit();

    expect(component.editUserForm.value).toEqual(user);
    expect(userService.getPatientById).toHaveBeenCalledWith(1);
  });

  it('should handle error while fetching user data', () => {
    const error = 'Error fetching user';
    userService.getPatientById.and.returnValue(throwError(error));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching user:', error);
  });

  it('should update user data on form submit', () => {
    const user: UserDto = new UserDto('user1', 'user1@example.com', 2, 'User', 'One');
    userService.updatePatient.and.returnValue(of(user));
    component.editUserForm.setValue(user);
    spyOn(window, 'alert');

    component.onSubmit();

    expect(userService.updatePatient).toHaveBeenCalledWith(1, user);
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
    expect(window.alert).toHaveBeenCalledWith('User updated successfully');
  });

  it('should handle error while updating user data', () => {
    const error = 'Error updating user';
    userService.updatePatient.and.returnValue(throwError(error));
    component.editUserForm.setValue(new UserDto('user1', 'user1@example.com', 2, 'User', 'One'));
    spyOn(console, 'error');

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Error updating user:', error);
  });
});
