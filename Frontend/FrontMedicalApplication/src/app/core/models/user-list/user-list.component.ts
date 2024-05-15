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

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  confirmDeleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.deleteUser(userId);
    }
    window.location.reload();
  }

  deleteUser(userId: number) {
    this.userService.deletePatient(userId).subscribe(() => {
      this.fetchUsers();
    }, error => {
      console.error('Failed to delete user:', error);
    });
  }

  constructor(private userService: UserService,private router: Router) {
    this.userService.getAllUsers().subscribe(users => this.users = users);
  }

  get roleId() {
    return this.user.roleId; 
  }

  set roleId(value: number) {
    this.user.roleId = value;
  }

  addUser(): void {
    this.router.navigate(['/user/add']);
  }

  editUser(userId: number): void {
    this.router.navigate(['/user/edit', userId]);
  }
}
