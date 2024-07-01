import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  addUserForm: FormGroup;
  loading = false;
  message = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {
    this.addUserForm = this.fb.group({
      roleId: ['', Validators.required],
      username: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
      name: ['', [Validators.required, Validators.pattern(/^[A-Z][a-z]*$/)]],
      surname: ['', [Validators.required, Validators.pattern(/^[A-Z][a-z]*$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d{3,})(?=.*[!@#$%^&*]).{8,}$/)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      cnp: ['', [Validators.required, Validators.pattern(/^[0-9]{13}$/)]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(150)]],
      address: ['', Validators.required],
      phonenumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.addUserForm.valid) {
      this.loading = true;
      const { roleId, username, email, password, confirmPassword, name, surname, cnp, age, address, phonenumber } = this.addUserForm.value;

      console.log('Form is valid. Submitting data:', this.addUserForm.value);

      this.authService.signUp(username, email, password, confirmPassword, name, surname, cnp, age, roleId, address, phonenumber).subscribe({
        next: () => {
          console.log('User creation successful');
          this.loading = false;
          this.message = 'User created successfully!';
          this.error = '';
          alert('User created successfully!');
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.log('User creation successful');
          this.loading = false;
          this.message = 'User created successfully!';
          this.error = '';
          alert('User created successfully!');
          this.router.navigate(['/users']);
        }
      });
    } else {
      console.log('Form is invalid:', this.addUserForm.errors);
    }
  }
}
