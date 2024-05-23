import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  resetError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void { }

  onRequestCode(): void {
    const emailControl = this.forgotPasswordForm.get('email');
    if (emailControl?.valid) {
      this.authService.requestResetCode(emailControl.value).subscribe({
        next: data => {
          console.log('Reset code sent!');
          this.router.navigate(['/reset-password'], { queryParams: { email: emailControl.value } });
        },
        error: error => {
          console.error('Error sending reset code', error);
          this.resetError = 'Error sending reset code';
        }
      });
    }
  }
}
