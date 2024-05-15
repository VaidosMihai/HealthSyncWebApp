import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../services/search-service.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  searchTerm: string = '';
  entityType: string = '';  // New property to store the entity type
  searchResults: any;
  isDoctor: boolean = false;
  isAdmin: boolean = false;
  isPatient: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isDoctor = currentUser.roleId === 1;
    this.isAdmin = currentUser.roleId === 3;
    this.isPatient = currentUser.roleId === 2;
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['term'];
      this.entityType = params['entityType'];
      // Make sure both parameters are not empty before performing the search
      if (this.searchTerm && this.entityType) {
        this.performSearch();
      }
    }); 
  }

  //FIRST VERSION
  // performSearch(): void {
  //   this.searchService.search(this.searchTerm, this.entityType).subscribe({
  //     next: (results) => {
  //       this.searchResults = results;
  //     },
  //     error: (error) => {
  //       // Log the error to the console
  //       console.error('Error performing search:', error);
  //       // Optionally, show the error to the user
  //       alert('Error performing search: ' + error.message);
  //     }
  //   });
  // }
  
  // SECOND VERSION
  // performSearch(): void {
  //   this.searchService.search(this.searchTerm, this.entityType).subscribe({
  //     next: (results) => {
  //       // Assuming the result is an array directly
  //       //this.searchResults = { users: results }; // Adjust depending on actual response structure
  //       this.searchResults = results;
  //     },
  //     error: (error) => {
  //       console.error('Error performing search:', error);
  //       alert('Error performing search: ' + error.message);
  //     }
  //   });
  // }

  performSearch(): void {
    if (!this.entityType || !this.searchTerm) {
      console.error('Search term or entity type is missing.');
      return;
    }
  
    // Select the appropriate search function based on the entity type
    let searchFunction;
    switch (this.entityType) {
      case 'users':
        searchFunction = this.searchService.searchUsers(this.searchTerm);
        break;
      case 'appointments':
        searchFunction = this.searchService.searchAppointments(this.searchTerm);
        break;
      case 'patientrecords':
        searchFunction = this.searchService.searchPatientRecords(this.searchTerm);
        break;
      case 'treatments':
        searchFunction = this.searchService.searchTreatments(this.searchTerm);
        break;
      case 'schedules':
        searchFunction = this.searchService.searchSchedules(this.searchTerm);
        break;
      case 'billings':
        searchFunction = this.searchService.searchBillings(this.searchTerm);
        break;
      default:
        console.error('Invalid entity type for search.');
        return;
    }
  
    // Execute the selected search function
    searchFunction.subscribe({
      next: (results) => {
        console.log("Received search results:", results);
        this.searchResults = results;
      },
      error: (error) => {
        console.error('Error performing search:', error);
        alert('Error performing search: ' + error.message);
      }
    });
  }
  
}
