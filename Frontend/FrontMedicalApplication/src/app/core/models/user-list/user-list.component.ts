import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { UserDto } from '../../dtos/user.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: UserDto[] = [];
  user: UserDto = new UserDto("","",0,"");

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  confirmDeleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.deleteUser(userId);
    }
  }

  deleteUser(userId: number) {
    this.userService.deletePatient(userId).subscribe(() => {
      this.fetchUsers(); // Reload users after deletion
    }, error => {
      console.error('Failed to delete user:', error);
    });
  }

  getRoleName(roleId: number): string {
    switch (roleId) {
      case 1:
        return 'Doctor';
      case 2:
        return 'Patient';
      case 3:
        return 'Administrator';
      default:
        return 'Unknown';
    }
  }

  addUser(): void {
    this.router.navigate(['/user/add']);
  }

  editUser(userId: number): void {
    this.router.navigate(['/user/edit', userId]);
  }
}
