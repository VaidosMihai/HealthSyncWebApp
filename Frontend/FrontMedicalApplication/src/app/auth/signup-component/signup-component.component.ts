// signup-component.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service.service';
import { Router } from '@angular/router';
import { UserDto } from '../../core/dtos/user.dto';

@Component({
  selector: 'app-signup',
  templateUrl: './signup-component.component.html',
  styleUrls: ['./signup-component.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  error = '';
  message = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      CNP: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      Address: ['', [Validators.required, Validators.minLength(6)]],
      PhoneNumber: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSignup() {
    if (this.signupForm.valid) {
      this.loading = true;
      const { username, email, password, confirmPassword, name, surname, CNP, age, Address, PhoneNumber } = this.signupForm.value;
      const roleId = 2; 
  
      this.authService.signUp(username, email, password, confirmPassword, name, surname, CNP, age, roleId, Address, PhoneNumber).subscribe({
        next: (response) => {
          this.message = 'Registration successful! Please check your email to verify your account.';
          if (typeof response.token === 'string') {
            //localStorage.setItem('token', response.token);
            localStorage.setItem('token', JSON.stringify(response));
            this.router.navigate(['/login']);
          } else {
            console.error('Token not found in response');
          }
          this.loading = false;
        },
        error: (error) => {
          // Handle any errors that occur during registration
          this.error = error;
          this.loading = false;
        }
      });
    }
  }
  
}
