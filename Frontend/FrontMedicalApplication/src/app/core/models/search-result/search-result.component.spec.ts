import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SearchResultComponent } from './search-result.component';
import { SearchService } from '../../services/search-service.service';

describe('SearchResultComponent', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;
  let searchService: jasmine.SpyObj<SearchService>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const searchServiceSpy = jasmine.createSpyObj('SearchService', [
      'searchUsers',
      'searchAppointments',
      'searchPatientRecords',
      'searchTreatments',
      'searchSchedules',
      'searchBillings'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ SearchResultComponent ],
      providers: [
        { provide: SearchService, useValue: searchServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ term: 'test', entityType: 'users' })
          }
        }
      ]
    })
    .compileComponents();

    searchService = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    route = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch search results on init', () => {
    const results = [{ id: 1, name: 'Test User' }];
    searchService.searchUsers.and.returnValue(of(results));

    component.ngOnInit();

    expect(component.searchResults).toEqual(results);
    expect(searchService.searchUsers).toHaveBeenCalledWith('test');
  });

  it('should handle error while fetching search results', () => {
    const error = 'Error performing search';
    searchService.searchUsers.and.returnValue(throwError(error));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error performing search:', error);
  });
});
