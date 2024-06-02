import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorListComponent } from './doctor-list.component';
import { UserService } from '../../services/user-service.service';
import { ReviewService } from '../../services/review-service.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { UserDto } from '../../dtos/user.dto';
import { ReviewDto } from '../../dtos/review.dto';

describe('DoctorListComponent', () => {
  let component: DoctorListComponent;
  let fixture: ComponentFixture<DoctorListComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let reviewService: jasmine.SpyObj<ReviewService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getAllUsersWithRoleId', 'getPatientById', 'updateDescription']);
    const reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['getReviewsByDoctorId', 'updateReviewHelpfulCount', 'updateReviewNotHelpfulCount', 'deleteReview', 'addReview']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [DoctorListComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    reviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(DoctorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load doctors on init', () => {
    const doctors: UserDto[] = [{ userId: 1, username: 'doctor1', emailAddress: 'doctor1@example.com', roleId: 1, name: 'Doctor', surname: 'One' }];
    userService.getAllUsersWithRoleId.and.returnValue(of(doctors));

    component.ngOnInit();

    expect(component.doctors).toEqual(doctors);
  });

  it('should handle error while loading doctors', () => {
    spyOn(console, 'error');
    userService.getAllUsersWithRoleId.and.returnValue(throwError('Error loading doctors'));

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('There was an error fetching the doctors', 'Error loading doctors');
  });

  it('should open review modal', () => {
    const doctor: UserDto = { userId: 1, username: 'doctor1', emailAddress: 'doctor1@example.com', roleId: 1, name: 'Doctor', surname: 'One' };
    const reviews: ReviewDto[] = [{ reviewId: 1, doctorId: 1, patientId: 1, rating: 5, comment: 'Great doctor', createdAt: new Date(), helpfulCount: 0, notHelpfulCount: 0, patientName: 'Patient', doctorName: 'Doctor', voteType: '' }];
    reviewService.getReviewsByDoctorId.and.returnValue(of(reviews));

    component.openReviewModal(doctor);

    expect(component.selectedDoctor).toEqual(doctor);
    expect(component.isReviewModalOpen).toBeTrue();
  });

  it('should submit review', () => {
    const currentUser: UserDto = { userId: 1, username: 'patient1', emailAddress: 'patient1@example.com', roleId: 2, name: 'Patient', surname: 'One' };
    const newReview: ReviewDto = { reviewId: 0, doctorId: 1, patientId: 1, rating: 5, comment: 'Great doctor', createdAt: new Date(), helpfulCount: 0, notHelpfulCount: 0, patientName: 'Patient', doctorName: 'Doctor', voteType: '' };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    reviewService.addReview.and.returnValue(of(newReview));

    component.newReview = newReview;
    component.submitReview();

    expect(reviewService.addReview).toHaveBeenCalledWith(newReview);
  });

  it('should handle error while submitting review', () => {
    spyOn(console, 'error');
    const currentUser: UserDto = { userId: 1, username: 'patient1', emailAddress: 'patient1@example.com', roleId: 2, name: 'Patient', surname: 'One' };
    const newReview: ReviewDto = { reviewId: 0, doctorId: 1, patientId: 1, rating: 5, comment: 'Great doctor', createdAt: new Date(), helpfulCount: 0, notHelpfulCount: 0, patientName: 'Patient', doctorName: 'Doctor', voteType: '' };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    reviewService.addReview.and.returnValue(throwError({ status: 400 }));

    component.newReview = newReview;
    component.submitReview();

    expect(console.error).toHaveBeenCalled();
  });
});
