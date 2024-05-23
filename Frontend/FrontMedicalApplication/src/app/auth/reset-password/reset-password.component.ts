import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  resetSuccess: boolean = false;
  resetError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('newPassword', 'confirmPassword')
    });
  }

  ngOnInit(): void {
  }

  onReset(): void {
    if (this.resetPasswordForm.valid) {
      const { email, code, newPassword } = this.resetPasswordForm.value;
      this.authService.resetPassword(email, code, newPassword).subscribe({
        next: data => {
          console.log('Password reset successful');
          this.resetSuccess = true;
          this.resetError = '';
          this.router.navigate(['/login']);  // Redirect to login page
        },
        error: error => {
          console.error('Error resetting password', error);
          this.resetError = 'Invalid code or failed to reset password';
        }
      });
    }
  }

  private mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
  
      if (!control || !matchingControl) {
        return null;
      }
  
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }
  
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
      return null;
    };
  }
}
