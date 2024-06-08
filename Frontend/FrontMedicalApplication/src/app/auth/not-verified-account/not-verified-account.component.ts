import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth-service.service';

@Component({
  selector: 'app-not-verified-account',
  templateUrl: './not-verified-account.component.html',
  styleUrls: ['./not-verified-account.component.css']
})
export class NotVerifiedAccountComponent {
  resendMessage = '';

  constructor(private authService: AuthService) {}

  resendVerificationEmail() {
    const email = localStorage.getItem('email');
    if (email) {
      this.authService.resendVerificationEmail(email).subscribe({
        next: (response) => {
          this.resendMessage = 'Verification email has been resent. Please check your inbox.';
        },
        error: (error) => {
          this.resendMessage = 'Failed to resend verification email. Please try again later.';
        }
      });
    }
  }
}
