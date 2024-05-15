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

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
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
    const phoneNumberControl = this.forgotPasswordForm.get('phoneNumber');
    if (phoneNumberControl?.valid) {
      this.authService.requestResetCode(phoneNumberControl.value).subscribe({
        next: data => console.log('Reset code sent!'),
        error: error => console.error('Error sending reset code', error)
      });
    }
  }

  onReset(): void {
    if (this.forgotPasswordForm.valid) {
      // Ensure that the form includes 'code' and 'newPassword' along with 'phoneNumber'
      this.authService.resetPassword(
        this.forgotPasswordForm.value.phoneNumber, 
        this.forgotPasswordForm.value.code, 
        this.forgotPasswordForm.value.newPassword
      ).subscribe({
        next: data => console.log('Password reset successful'),
        error: error => console.error('Error resetting password', error)
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
