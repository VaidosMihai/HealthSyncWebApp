import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PatientProfileComponent } from './patient-profile.component';
import { UserService } from '../../../services/user-service.service';
import { ReviewService } from '../../../services/review-service.service';
import { ProfileService } from '../../../services/profile.service';
import { AuthService } from '../../../services/auth-service.service';
import { UserDto } from '../../../dtos/user.dto';
import { ReviewDto } from '../../../dtos/review.dto';

describe('PatientProfileComponent', () => {
  let component: PatientProfileComponent;
  let fixture: ComponentFixture<PatientProfileComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let reviewService: jasmine.SpyObj<ReviewService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['updatePatient', 'getPatientById', 'getUserById']);
    const reviewServiceSpy = jasmine.createSpyObj('ReviewService', [
      'getReviewsByPatientId',
      'getReviewsByDoctorId',
      'updateReviewHelpfulCount',
      'updateReviewNotHelpfulCount',
      'deleteReview'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [PatientProfileComponent],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceSpy },
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} }
          }
        }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    reviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(PatientProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile on init', () => {
    const user: UserDto = new UserDto('user1', 'user1@example.com', 2, 'User', 'One');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));
    userService.getPatientById.and.returnValue(of(user));

    component.ngOnInit();

    expect(component.patientData).toEqual(user);
  });

  it('should handle error while loading user profile', () => {
    const error = 'Error fetching user';
    userService.getPatientById.and.returnValue(throwError(error));
    spyOn(console, 'error');

    component.loadUserProfile();

    expect(console.error).toHaveBeenCalledWith('Error fetching user:', error);
  });

  it('should update user profile', () => {
    const user: UserDto = new UserDto('user1', 'user1@example.com', 2, 'User', 'One');
    user.userId = 1; // ensure userId is not undefined
    userService.updatePatient.and.returnValue(of(user));
    component.patientForm.setValue(user);
    spyOn(window, 'alert');

    component.onSaveProfile();

    expect(userService.updatePatient).toHaveBeenCalledWith(user.userId as number, user);
    expect(window.alert).toHaveBeenCalledWith('Personal information was updated.');
  });

  it('should handle error while updating user profile', () => {
    const error = 'Error updating user';
    userService.updatePatient.and.returnValue(throwError(error));
    component.patientForm.setValue(new UserDto('user1', 'user1@example.com', 2, 'User', 'One'));
    spyOn(console, 'error');

    component.onSaveProfile();

    expect(console.error).toHaveBeenCalledWith('Failed to update profile:', error);
  });

  it('should mark review as helpful', () => {
    const review: ReviewDto = { reviewId: 1, doctorId: 1, patientId: 1, rating: 5, comment: 'Good', createdAt: new Date(), helpfulCount: 0, notHelpfulCount: 0, voteType: '' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ userId: 1 }));
    reviewService.updateReviewHelpfulCount.and.returnValue(of());

    component.markHelpful(review);

    expect(reviewService.updateReviewHelpfulCount).toHaveBeenCalledWith(1, 1);
  });

  it('should handle error while marking review as helpful', () => {
    const error = 'Error marking review as helpful';
    reviewService.updateReviewHelpfulCount.and.returnValue(throwError(error));
    const review: ReviewDto = { reviewId: 1, doctorId: 1, patientId: 1, rating: 5, comment: 'Good', createdAt: new Date(), helpfulCount: 0, notHelpfulCount: 0, voteType: '' };
    spyOn(console, 'error');

    component.markHelpful(review);

    expect(console.error).toHaveBeenCalledWith('Failed to update helpful count', error);
  });

  it('should mark review as not helpful', () => {
    const review: ReviewDto = { reviewId: 1, doctorId: 1, patientId: 1, rating: 5, comment: 'Good', createdAt: new Date(), helpfulCount: 0, notHelpfulCount: 0, voteType: '' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ userId: 1 }));
    reviewService.updateReviewNotHelpfulCount.and.returnValue(of());

    component.markNotHelpful(review);

    expect(reviewService.updateReviewNotHelpfulCount).toHaveBeenCalledWith(1, 1);
  });

  it('should handle error while marking review as not helpful', () => {
    const error = 'Error marking review as not helpful';
    reviewService.updateReviewNotHelpfulCount.and.returnValue(throwError(error));
    const review: ReviewDto = { reviewId: 1, doctorId: 1, patientId: 1, rating: 5, comment: 'Good', createdAt: new Date(), helpfulCount: 0, notHelpfulCount: 0, voteType: '' };
    spyOn(console, 'error');

    component.markNotHelpful(review);

    expect(console.error).toHaveBeenCalledWith('Failed to update not helpful count', error);
  });

  it('should delete review', () => {
    const reviewId = 1;
    reviewService.deleteReview.and.returnValue(of());

    component.deleteReview(reviewId);

    expect(reviewService.deleteReview).toHaveBeenCalledWith(reviewId);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/', { skipLocationChange: true });
  });

  it('should handle error while deleting review', () => {
    const error = 'Error deleting review';
    reviewService.deleteReview.and.returnValue(throwError(error));
    spyOn(console, 'error');

    component.deleteReview(1);

    expect(console.error).toHaveBeenCalledWith('Failed to delete review', error);
  });

  it('should logout user', () => {
    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should sort reviews by relevant', () => {
    const event = { target: { value: 'relevant' } } as unknown as Event;
    component.filteredReviews = [
      { reviewId: 1, doctorId: 1, patientId: 1, rating: 5, comment: 'Good', createdAt: new Date(), helpfulCount: 2, notHelpfulCount: 0, voteType: '' },
      { reviewId: 2, doctorId: 1, patientId: 1, rating: 4, comment: 'Okay', createdAt: new Date(), helpfulCount: 3, notHelpfulCount: 0, voteType: '' }
    ];

    component.sortReviews(event);

    expect(component.filteredReviews[0].reviewId).toBe(2);
  });

  it('should sort reviews by recent', () => {
    const event = { target: { value: 'recent' } } as unknown as Event;
    component.filteredReviews = [
      { reviewId: 1, doctorId: 1, patientId: 1, rating: 5, comment: 'Good', createdAt: new Date(Date.now() - 1000), helpfulCount: 0, notHelpfulCount: 0, voteType: '' },
      { reviewId: 2, doctorId: 1, patientId: 1, rating: 4, comment: 'Okay', createdAt: new Date(Date.now()), helpfulCount: 0, notHelpfulCount: 0, voteType: '' }
    ];

    component.sortReviews(event);

    expect(component.filteredReviews[0].reviewId).toBe(2);
  });
});
