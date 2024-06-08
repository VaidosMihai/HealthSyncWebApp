import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.authService.getUserDataByEmail(email).subscribe(
            userData => {
              this.router.navigate(['/dashboard']);
              this.loading = false;
              this.loginError = '';
            },
            userError => {
              console.error('Failed to load user data:', userError);
              this.loading = false;
            }
          );
        },
        error: (error) => {
          if (error.status === 401 && error.error.message === 'Email not verified') {
            this.router.navigate(['/not-verified']);
          } else {
            this.loginError = 'Incorrect username or password. Please try again.';
          }
          this.loading = false;
        }
      });
    }
  }
}
