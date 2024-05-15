// user-add.component.ts
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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {
    this.addUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      CNP: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      roleId: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(6)]],
      phonenumber: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
  }

  onSubmit(){
    const {roleId, username, email, password, confirmPassword, name, surname, CNP, age, address, phonenumber} = this.addUserForm.value;

    this.authService.signUp(username, email, password, confirmPassword, name, surname, CNP, age, roleId, address, phonenumber).subscribe({
      next: (response) => {
        if (typeof response.token === 'string') {
          this.router.navigate(['/users']);
        } else {
          console.error('Token not found in response');
        }
      },
      error: (error) => {
        console.error('Error creating user:', error);
      }
    });
  }

}
