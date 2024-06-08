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
  filteredUsers: UserDto[] = [];
  searchName: string = '';
  searchCnp: string = '';
  sortOrder: string = 'asc'; // Default sort order

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users; // Initialize the filtered users list
      this.sortUsers(); // Sort users initially
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  filterUsers() {
    const searchName = this.searchName.toLowerCase();
    const searchCnp = this.searchCnp;
    this.filteredUsers = this.users.filter(user =>
      (user.name.toLowerCase().includes(searchName) || user.surname.toLowerCase().includes(searchName)) &&
      (user.cnp?.includes(searchCnp) ?? false)
    );
    this.sortUsers(); // Sort users after filtering
  }

  sortUsers() {
    this.filteredUsers.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (this.sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

  confirmDeleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.deleteUser(userId);
    }
  }

  deleteUser(userId: number) {
    this.userService.deletePatient(userId).subscribe(response => {
      console.log(`Successfully deleted user with ID: ${userId}`);
      console.log('Server response:', response);
      this.users = this.users.filter(user => user.userId !== userId); // Remove the deleted user from the list
      this.filteredUsers = this.filteredUsers.filter(user => user.userId !== userId); // Remove the deleted user from the filtered list
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
