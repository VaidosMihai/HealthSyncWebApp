import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user-service.service';
import { ReviewService } from '../../../services/review-service.service';
import { ProfileService } from '../../../services/profile.service';
import { UserDto } from '../../../dtos/user.dto';
import { ReviewDto } from '../../../dtos/review.dto';
import { AuthService } from '../../../services/auth-service.service';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css']
})
export class PatientProfileComponent implements OnInit {
  patientForm: FormGroup;
  patientData: UserDto;
  reviews: ReviewDto[] = [];
  filteredReviews: ReviewDto[] = [];
  isDoctor: boolean = false;
  isAdmin: boolean = false;
  isPatient: boolean = false;
  starRatings: { stars: string, percentage: number, count: number }[] = [];
  ratingBreakdown = [
    { category: 'Seller communication level', rating: 5 },
    { category: 'Recommend to a friend', rating: 5 },
    { category: 'Service as described', rating: 4.9 }
  ];
  averageRating = 0;
  currentUser: UserDto | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private profileService: ProfileService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.patientForm = this.fb.group({
      userId: [''],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      cnp: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      roleId: [2],
      password: [''],
      address: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required]]
    });

    this.patientData = new UserDto('', '', 0, '', '', '', 0);
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => this.currentUser = user);
    this.loadUserProfile();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.name && currentUser.surname) {
      this.isDoctor = currentUser.roleId === 1;
      this.isAdmin = currentUser.roleId === 3;
      this.isPatient = currentUser.roleId === 2;
    }
  }

  loadUserProfile() {
    const currentUserJson = localStorage.getItem('currentUser');
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson);
      if (currentUser) {
        this.patientData = currentUser;
        this.patientForm.patchValue({
          userId: currentUser.userId,
          roleId: currentUser.roleId,
          name: currentUser.name,
          surname: currentUser.surname,
          cnp: currentUser.cnp,
          age: currentUser.age,
          emailAddress: currentUser.emailAddress,
          username: currentUser.username,
          address: currentUser.address,
          phoneNumber: currentUser.phoneNumber,
          password: localStorage.getItem('token'),
          description: currentUser.description
        });
        if (currentUser.roleId === 1) {
          this.loadReviewsForDoctor(currentUser.userId);
        } else if (currentUser.roleId === 2 || currentUser.roleId === 3) {
          this.loadReviewsForPatient(currentUser.userId);
        }
      }
    }
  }

  loadReviewsForPatient(patientId: number): void {
    this.reviewService.getReviewsByPatientId(patientId).pipe(
      switchMap(reviews => {
        this.reviews = reviews;
        this.filteredReviews = [...this.reviews];
        const doctorObservables = reviews.map(review =>
          this.userService.getUserById(review.doctorId)
        );
        return forkJoin(doctorObservables);
      })
    ).subscribe({
      next: (doctors) => {
        this.reviews.forEach((review, index) => {
          const doctor = doctors[index];
          review.doctorName = `${doctor.name} ${doctor.surname}`;
        });
        this.updateStarRatings();
      },
      error: (error) => {
        console.error('Failed to load reviews', error);
      }
    });
  }

  loadReviewsForDoctor(doctorId: number): void {
    this.reviewService.getReviewsByDoctorId(doctorId).pipe(
      switchMap(reviews => {
        this.reviews = reviews;
        this.filteredReviews = [...this.reviews];
        const userObservables = reviews.map(review =>
          this.userService.getPatientById(review.patientId)
        );
        return forkJoin(userObservables);
      })
    ).subscribe({
      next: (users) => {
        this.reviews.forEach((review, index) => {
          const user = users[index];
          review.patientName = `${user.username} (${user.name} ${user.surname})`;
        });
        this.updateStarRatings();
      },
      error: (error) => {
        console.error('Failed to load reviews', error);
      }
    });
  }

  updateStarRatings(): void {
    const totalReviews = this.reviews.length;
    let totalRating = 0;
    const starCounts = [0, 0, 0, 0, 0];

    this.reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        starCounts[5 - review.rating]++;
        totalRating += review.rating;
      }
    });

    this.starRatings = starCounts.map((count, index) => ({
      stars: `${5 - index} Star${(5 - index) > 1 ? 's' : ''}`,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
      count: count
    }));

    this.averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
  }

  filterReviews(starCount: number): void {
    this.filteredReviews = this.reviews.filter(review => review.rating === starCount);
  }

  clearFilter(): void {
    this.filteredReviews = [...this.reviews];
  }

  onSaveProfile() {
    const formData: UserDto = this.patientForm.value;
    const userId = formData.userId;

    if (userId && !isNaN(userId)) {
      this.userService.updatePatient(userId, formData).subscribe({
        next: (updatedUser) => {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          alert("Personal information was updated.");
        },
        error: (error) => {
          if (error.status === 400) {
            console.error('Validation failed:', error.error);
          } else {
            console.error('Failed to update profile:', error.message);
          }
        }
      });
    } else {
      console.error('Invalid user ID:', userId);
    }
  }

  markHelpful(review: ReviewDto): void {
    const currentUserJson = localStorage.getItem('currentUser');
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
    if (currentUser) {
      this.reviewService.updateReviewHelpfulCount(review.reviewId, currentUser.userId).subscribe({
        next: () => {
          if (review.voteType === 'not-helpful') {
            review.notHelpfulCount = Math.max(0, review.notHelpfulCount - 1);
          }
          review.helpfulCount = review.voteType === 'helpful' ? Math.max(0, review.helpfulCount - 1) : review.helpfulCount + 1;
          review.voteType = review.voteType === 'helpful' ? '' : 'helpful';
          console.log('Marked as helpful');
        },
        error: (error) => console.error('Failed to update helpful count', error)
      });
    }
  }

  markNotHelpful(review: ReviewDto): void {
    const currentUserJson = localStorage.getItem('currentUser');
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
    if (currentUser) {
      this.reviewService.updateReviewNotHelpfulCount(review.reviewId, currentUser.userId).subscribe({
        next: () => {
          if (review.voteType === 'helpful') {
            review.helpfulCount = Math.max(0, review.helpfulCount - 1);
          }
          review.notHelpfulCount = review.voteType === 'not-helpful' ? Math.max(0, review.notHelpfulCount - 1) : review.notHelpfulCount + 1;
          review.voteType = review.voteType === 'not-helpful' ? '' : 'not-helpful';
          console.log('Marked as not helpful');
        },
        error: (error) => console.error('Failed to update not helpful count', error)
      });
    }
  }

  deleteReview(reviewId: number): void {
    if (reviewId != null) {
      this.reviewService.deleteReview(reviewId).subscribe({
        next: () => {
          console.log('Review deleted successfully');
          window.location.reload();
          if (this.currentUser?.roleId === 1) {
            this.loadReviewsForDoctor(this.currentUser?.userId ?? 0);
          } else {
            this.loadReviewsForPatient(this.currentUser?.userId ?? 0);
          }
        },
        error: (error) => {
          console.error('Failed to delete review', error);
        }
      });
    } else {
      console.error('Invalid reviewId');
    }
  }

  sortReviews(event: Event): void {
    const target = event.target as HTMLSelectElement | null;

    if (target) {
      const criteria = target.value;

      if (criteria === 'relevant') {
        this.filteredReviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
      } else if (criteria === 'recent') {
        this.filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } else {
      console.error('Event target is not an HTMLSelectElement:', event.target);
    }
  }

  confirmDeleteUser(userId: number | undefined) {
    if (userId !== undefined && confirm('Are you sure you want to delete this user?')) {
      this.deleteUser(userId);
    }
  }

  deleteUser(userId: number) {
    this.userService.deletePatient(userId).subscribe(() => {
    }, error => {
      console.error('Failed to delete user:', error);
    });
    this.logout();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
