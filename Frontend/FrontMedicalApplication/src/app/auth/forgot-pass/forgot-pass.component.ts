import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../../core/services/auth-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  requestCodeSent: boolean = false;
  resetError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { // Add Router to constructor
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
          this.router.navigate(['/reset-password']); // Redirect without query params
        },
        error: error => {
          console.error('Error sending reset code', error);
          this.resetError = 'Error sending reset code';
        }
      });
    }
  }
}
