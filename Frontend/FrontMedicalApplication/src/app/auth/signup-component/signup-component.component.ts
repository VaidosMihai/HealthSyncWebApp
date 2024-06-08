import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
      name: ['', [Validators.required, Validators.pattern('^[A-Z][a-zA-Z]*$')]],
      surname: ['', [Validators.required, Validators.pattern('^[A-Z][a-zA-Z]*$')]],
      CNP: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(150)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]{3,})(?=.*[!@#$%^&*]).+$')]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), this.passwordMatchValidator]],
      Address: ['', [Validators.required, Validators.minLength(6)]],
      PhoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  passwordMatchValidator(control: FormControl) {
    const password = control.root.get('password');
    return password && control.value !== password.value ? { mismatch: true } : null;
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
            localStorage.setItem('token', JSON.stringify(response));
            this.router.navigate(['/login']);
          } else {
            console.error('Token not found in response');
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = error.error.message || 'An error occurred during registration';
          this.loading = false;
        }
      });
    }
  }
  
}
