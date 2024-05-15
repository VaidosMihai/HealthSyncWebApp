// user-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDto } from '../../dtos/user.dto';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  editUserForm: FormGroup;
  userId: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userId = this.route.snapshot.params['id'];
    this.editUserForm = this.fb.group({
      userId: ['', Validators.required],
      username: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      cnp: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required]],
      roleId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getPatientById(this.userId).subscribe({
        next: (user: UserDto) => { // Cast response as UserDto
          console.log('Fetched User:', user); // Log fetched user data for debugging
          this.editUserForm.patchValue(user);
        },
        error: (error) => {
          console.error('Error fetching user:', error);
        }
      });
    }
  }

  onSubmit() {
    if (this.editUserForm.valid) {
      this.userService.updatePatient(this.userId, this.editUserForm.value).subscribe({
        next: (updatedUser) => {
          console.log('User updated successfully', updatedUser);
          this.router.navigate(['/users']); // Redirect to the users list
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    }
  }
}
