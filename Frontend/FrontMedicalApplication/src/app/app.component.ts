import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { AuthService } from './core/services/auth-service.service';
import { ProfileService } from './core/services/profile.service';
import { SearchService } from './core/services/search-service.service';
import { NotificationService } from './core/services/notification-service.service';
import { NotificationDto } from './core/dtos/notification.dto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  isLoggedIn: boolean = false;
  isDoctor: boolean = false;
  isAdmin: boolean = false;
  isPatient: boolean = false;

  searchTerm: string = '';
  selectedEntityType: string = 'users';
  searchResults: any = null;
  private authSubscription?: Subscription;
  private userSubscription?: Subscription;
  private notificationIntervalSubscription?: Subscription;
  currentUserFullName: string = '';
  notifications: NotificationDto[] = [];
  unreadNotificationsCount: number = 0;
  showNotifications: boolean = false;
  currentUserId: number = 0;

  constructor(private router: Router, private authService: AuthService,
              private profileService: ProfileService, private searchService: SearchService,
              private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
      this.setCurrentUserFullName();
    });

    this.userSubscription = this.authService.currentUser.subscribe(user => {
      if (user) {
        this.isDoctor = user.roleId === 1;
        this.isAdmin = user.roleId === 3;
        this.isPatient = user.roleId === 2;
        this.currentUserFullName = `${user.name} ${user.surname}`;
        this.currentUserId = user.userId ?? 0; // Ensure currentUserId is a number

        if (this.isDoctor && user.userId) {
          this.startNotificationPolling(user.userId);
        }
      } else {
        this.isDoctor = this.isAdmin = this.isPatient = false;
        this.currentUserFullName = '';
        this.currentUserId = 0; // Reset currentUserId
        if (this.notificationIntervalSubscription) {
          this.notificationIntervalSubscription.unsubscribe();
        }
      }
    });
  }

  setCurrentUserFullName(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.name && currentUser.surname) {
      this.currentUserFullName = `${currentUser.name} ${currentUser.surname}`;
      this.isDoctor = currentUser.roleId === 1;
      this.isAdmin = currentUser.roleId === 3;
      this.isPatient = currentUser.roleId === 2;
      this.currentUserId = currentUser.userId ?? 0; // Ensure currentUserId is set
      this.startNotificationPolling(this.currentUserId); // Start polling
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.notificationIntervalSubscription) {
      this.notificationIntervalSubscription.unsubscribe();
    }
  }

  onSearch(): void {
    if (!this.searchTerm || !this.selectedEntityType) {
      alert('Please enter a search term and select an entity type.');
      return;
    }

    switch (this.selectedEntityType) {
      case 'users':
        this.searchUsers();
        break;
      case 'appointments':
        this.searchAppointments();
        break;
      case 'patientRecords':
        this.searchPatientRecords();
        break;
      case 'treatments':
        this.searchTreatments();
        break;
      case 'schedules':
        this.searchSchedules();
        break;
      case 'billings':
        this.searchBillings();
        break;
      default:
        alert('Selected entity type is not recognized.');
    }
  }

  searchUsers() {
    this.searchService.searchUsers(this.searchTerm).subscribe(this.handleSearchResults(), this.handleSearchError());
  }

  searchAppointments() {
    this.searchService.searchAppointments(this.searchTerm).subscribe(this.handleSearchResults(), this.handleSearchError());
  }

  searchPatientRecords() {
    this.searchService.searchPatientRecords(this.searchTerm).subscribe(this.handleSearchResults(), this.handleSearchError());
  }

  searchTreatments() {
    this.searchService.searchTreatments(this.searchTerm).subscribe(this.handleSearchResults(), this.handleSearchError());
  }

  searchSchedules() {
    this.searchService.searchSchedules(this.searchTerm).subscribe(this.handleSearchResults(), this.handleSearchError());
  }

  searchBillings() {
    this.searchService.searchBillings(this.searchTerm).subscribe(this.handleSearchResults(), this.handleSearchError());
  }

  handleSearchResults(): (results: any) => void {
    return results => {
      this.searchResults = results;
      console.log("Search results:", this.searchResults);
      this.router.navigate(['/search'], {
        queryParams: { term: this.searchTerm, entityType: this.selectedEntityType }
      });
    };
  }

  handleSearchError(): (error: any) => void {
    return error => {
      console.error('Search failed:', error);
      alert('Search failed: ' + error.message);
    };
  }

  startNotificationPolling(userId: number): void {
    const fetchNotifications = (): void => {
      this.notificationService.getUnreadNotificationsCount(userId).subscribe(
        (count: number) => this.unreadNotificationsCount = count,
        error => console.error('Failed to fetch notifications', error)
      );
    };
  
    fetchNotifications(); // Initial fetch
    this.notificationIntervalSubscription = interval(60000).subscribe(fetchNotifications);
  }

  viewNotifications(): void {
    this.showNotifications = !this.showNotifications;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
    if (currentUser && currentUser.userId) {
      this.notificationService.getNotificationsByUserId(currentUser.userId).subscribe(
        (notifications: NotificationDto[]) => {
          this.notifications = notifications;
          console.log('Fetched notifications:', notifications);
          const notificationList = document.querySelector('app-notification-list') as any;
          if (notificationList) {
            notificationList.toggleModal();
          }
        },
        error => {
          console.error('Failed to fetch notifications', error);
          alert('Failed to load notifications: ' + error.message);
        }
      );
    } else {
      console.error('No current user found in localStorage.');
      alert('User not found. Please log in again.');
    }
  }

  updateUnreadCount(): void {
    this.notificationService.getUnreadNotificationsCount(this.currentUserId).subscribe(
      (count: number) => this.unreadNotificationsCount = count,
      error => console.error('Failed to update unread notifications count', error)
    );
  }
}
