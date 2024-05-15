import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { ReviewService } from '../../services/review-service.service';
import { UserDto } from '../../dtos/user.dto';
import { ReviewDto } from '../../dtos/review.dto';
import { Router } from '@angular/router';
import { AppointmentDto } from '../../dtos/appointment.dto';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})
export class DoctorListComponent implements OnInit {
  doctors: UserDto[] = [];
  reviews: ReviewDto[] = [];
  newReview: ReviewDto = {
    reviewId: 0,
    doctorId: 0,
    patientId: 0,
    rating: 0,
    comment: '',
    createdAt: new Date(),
    helpfulCount: 0,
    notHelpfulCount: 0,
    patientName: '',
    doctorName: '',
  };
  selectedDoctor: UserDto | null = null;
  isReviewModalOpen = false;
  doctorReviews: ReviewDto[] = [];
  doctorAppointments: AppointmentDto[] = [];
  starRatings: { stars: string, percentage: number, count: number }[] = [];
  ratingBreakdown = [
    { category: 'Seller communication level', rating: 5 },
    { category: 'Recommend to a friend', rating: 5 },
    { category: 'Service as described', rating: 4.9 }
  ];

  responseComment: string = ''; // Add this property
  averageRating: number = 0; // Add averageRating property

  constructor(
    private userService: UserService,
    private reviewService: ReviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.userService.getAllUsersWithRoleId(1).subscribe({
      next: (data) => {
        this.doctors = data.filter(user => user.roleId === 1);
      },
      error: (error) => {
        console.error('There was an error fetching the doctors', error);
      }
    });
  }

  scheduleAppointment(doctorUsername: string): void {
    const currentUserJson = localStorage.getItem('currentUser');
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
    const patientUsername = currentUser?.username;

    this.router.navigate(['/appointment/add'], { queryParams: { doctorUsername, patientUsername } });
  }

  loadReviews(doctorId: number): void {
    this.reviewService.getReviewsByDoctorId(doctorId).pipe(
      switchMap(reviews => {
        this.reviews = reviews;
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
        this.calculateAverageRating();
      },
      error: (error) => {
        console.error('Failed to load reviews', error);
      }
    });
  }

  updateStarRatings(): void {
    const totalReviews = this.reviews.length;
    const starCounts = [0, 0, 0, 0, 0]; // 1 to 5 stars

    this.reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        starCounts[5 - review.rating]++;
      }
    });

    this.starRatings = starCounts.map((count, index) => ({
      stars: `${5 - index} Star${(5 - index) > 1 ? 's' : ''}`,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
      count: count
    }));
  }

  calculateAverageRating(): void {
    if (this.reviews.length > 0) {
      const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      this.averageRating = totalRating / this.reviews.length;
    } else {
      this.averageRating = 0;
    }
  }

  openReviewModal(doctor: UserDto): void {
    this.selectedDoctor = doctor;
    this.newReview.doctorId = doctor.userId!;
    this.loadReviews(doctor.userId!);
    this.isReviewModalOpen = true;
  }

  closeReviewModal(): void {
    this.isReviewModalOpen = false;
    this.selectedDoctor = null;
    this.newReview = {
      reviewId: 0,
      doctorId: 0,
      patientId: 0,
      rating: 0,
      comment: '',
      createdAt: new Date(),
      helpfulCount: 0,
      notHelpfulCount: 0,
      patientName: '',
      doctorName: '',
    };
    this.responseComment = ''; // Reset response comment
  }

  submitReview(): void {
    const currentUserJson = localStorage.getItem('currentUser');
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;

    if (currentUser) {
      this.newReview.patientId = currentUser.userId;
      this.newReview.createdAt = new Date();

      // Create a copy of newReview to avoid directly modifying the component property
      const reviewToSubmit: ReviewDto = { ...this.newReview };

      // Ensure responseComment is not included in the review submission if empty
      if (this.responseComment && this.responseComment.trim() !== '') {
        reviewToSubmit.responseComment = this.responseComment;
      } else {
        delete reviewToSubmit.responseComment; // Ensure payload does not include undefined properties
      }

      this.reviewService.addReview(reviewToSubmit).subscribe(
        (review) => {
          console.log('Review submitted successfully', review);
          this.loadReviews(this.newReview.doctorId);
          this.closeReviewModal();
        },
        (error) => {
          console.error('Failed to submit review', error);
        }
      );
    }
  }

  markHelpful(review: ReviewDto): void {
    const currentUserJson = localStorage.getItem('currentUser');
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
    if (currentUser) {
      this.reviewService.updateReviewHelpfulCount(review).subscribe({
        next: () => {
          review.helpfulCount = (review.helpfulCount || 0) + 1;
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
      this.reviewService.updateReviewNotHelpfulCount(review).subscribe({
        next: () => {
          review.notHelpfulCount = (review.notHelpfulCount || 0) + 1;
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
          this.loadReviews(this.selectedDoctor?.userId ?? 0); // Reload reviews for the current doctor
        },
        error: (error) => {
          console.error('Failed to delete review', error);
        }
      });
    } else {
      console.error('Invalid reviewId');
    }
  }
}
