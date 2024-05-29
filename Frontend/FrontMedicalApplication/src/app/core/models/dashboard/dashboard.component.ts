import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isDoctor: boolean = false;
  isAdmin: boolean = false;
  isPatient: boolean = false;

  constructor() { }

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.name && currentUser.surname) {
      this.isDoctor = currentUser.roleId === 1;
      this.isAdmin = currentUser.roleId === 3;
      this.isPatient = currentUser.roleId === 2;
    }
  }

  getLink(buttonLabel: string): string {
    switch(buttonLabel) {
      case 'Locations': return '/locations';
      case 'Doctors': return '/doctors';
      case 'Appointments': return '/appointment';
      case 'Profile': return '/profile';
      case 'Users': return '/users';
      case 'Patients': return '/patients';
      case 'ContactInfo': return '/contactinfo';
      case 'ContactForms': return '/contact-forms';
      default: return '/';
    }
  }
}
