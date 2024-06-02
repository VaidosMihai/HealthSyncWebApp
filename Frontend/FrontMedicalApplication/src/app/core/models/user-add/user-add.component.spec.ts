import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserAddComponent } from './user-add.component';
import { UserService } from '../../services/user-service.service';
import { AuthService } from '../../services/auth-service.service';

describe('UserAddComponent', () => {
  let component: UserAddComponent;
  let fixture: ComponentFixture<UserAddComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signUp']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ UserAddComponent ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(UserAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sign up user on form submit', () => {
    const user = {
      username: 'user1',
      email: 'user1@example.com',
      password: 'password',
      confirmPassword: 'password',
      name: 'User',
      surname: 'One',
      CNP: '1234567890123',
      age: 30,
      roleId: 2,
      address: 'Address',
      phonenumber: '1234567890'
    };
    component.addUserForm.setValue(user);

    component.onSubmit();

    expect(authService.signUp).toHaveBeenCalledWith(
      user.username,
      user.email,
      user.password,
      user.confirmPassword,
      user.name,
      user.surname,
      user.CNP,
      user.age,
      user.roleId,
      user.address,
      user.phonenumber
    );
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should handle error while signing up user', () => {
    const error = 'Error creating user';
    authService.signUp.and.returnValue(throwError(error));
    spyOn(console, 'error');

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Error creating user:', error);
  });
});
