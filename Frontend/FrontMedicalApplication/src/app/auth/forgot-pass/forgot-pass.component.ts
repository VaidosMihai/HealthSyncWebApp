import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  requestCodeSent: boolean = false;
  resetSuccess: boolean = false;
  resetError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
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

  onRequestCode(): void {
    const emailControl = this.forgotPasswordForm.get('email');
    if (emailControl?.valid) {
      this.authService.requestResetCode(emailControl.value).subscribe({
        next: data => {
          console.log('Reset code sent!');
          this.requestCodeSent = true;
        },
        error: error => console.error('Error sending reset code', error)
      });
    }
  }

  onReset(): void {
    if (this.forgotPasswordForm.valid) {
      const { email, code, newPassword } = this.forgotPasswordForm.value;
      this.authService.resetPassword(email, code, newPassword).subscribe({
        next: data => {
          console.log('Password reset successful');
          this.resetSuccess = true;
          this.resetError = '';
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
