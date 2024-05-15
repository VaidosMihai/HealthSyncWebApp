import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login-component.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // If AuthService makes HTTP requests
import { AuthService } from '../../core/services/auth-service.service'; // Adjust the path as needed

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule], // Include ReactiveFormsModule here
      providers: [AuthService] // Provide AuthService if it's not provided in root
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
