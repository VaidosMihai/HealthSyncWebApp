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
      roleId: ['', Validators.required],
      username: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
      name: ['', [Validators.required, Validators.pattern(/^[A-Z][a-z]*$/)]],
      surname: ['', [Validators.required, Validators.pattern(/^[A-Z][a-z]*$/)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      cnp: ['', [Validators.required, Validators.pattern(/^[0-9]{13}$/)]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(150)]],
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.userId) {
      this.userService.getPatientById(this.userId).subscribe({
        next: (user: UserDto) => {
          console.log('Fetched User:', user);
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
          alert('User updated successfully');
          console.log('User updated successfully', updatedUser);
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    }
  }
}
