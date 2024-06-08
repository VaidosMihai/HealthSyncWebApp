import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { ReviewService } from '../../services/review-service.service';
import { UserDto } from '../../dtos/user.dto';
import { ReviewDto } from '../../dtos/review.dto';
import { Router } from '@angular/router';
import { AppointmentDto } from '../../dtos/appointment.dto';
import { forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})
export class DoctorListComponent implements OnInit {
  doctors: UserDto[] = [];
  filteredDoctors: UserDto[] = [];
  cities: string[] = ['Miercurea Ciuc', 'București', 'Cluj', 'Timișoara', 'Brașov'];
  specializations: string[] = [];
  selectedCity: string = '';
  selectedSpecialization: string = '';
  selectedSortOrder: string = 'desc';
  selectedSortReviewCountOrder: string = 'desc';
  editingDescriptionId: number | null = null;
  newDescription: string = '';
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
    voteType: ''
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

  responseComment: string = '';
  averageRating: number = 0;
  averageRatings: { [key: number]: number } = {};
  reviewCounts: { [key: number]: number } = {};

  constructor(
    private userService: UserService,
    private reviewService: ReviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.initializeStarRatings();
  }

  initializeStarRatings(): void {
    this.starRatings = [
      { stars: '5', percentage: 0, count: 0 },
      { stars: '4', percentage: 0, count: 0 },
      { stars: '3', percentage: 0, count: 0 },
      { stars: '2', percentage: 0, count: 0 },
      { stars: '1', percentage: 0, count: 0 }
    ];
  }

  loadDoctors(): void {
    this.userService.getAllUsersWithRoleId(1).subscribe({
      next: (data: UserDto[]) => {
        this.doctors = data.filter(user => user.roleId === 1);
        this.filteredDoctors = this.doctors;
        this.extractSpecializations();
        this.loadDoctorReviews();
      },
      error: (error: any) => {
        console.error('There was an error fetching the doctors', error);
      }
    });
  }

  loadDoctorReviews(): void {
    const reviewObservables = this.doctors.map(doctor => 
      this.reviewService.getReviewsByDoctorId(doctor.userId!).pipe(
        map(reviews => {
          doctor.reviews = reviews;
          doctor.averageRating = this.calculateDoctorAverageRating(reviews);
          doctor.reviewCount = reviews.length;
          return doctor;
        })
      )
    );

    forkJoin(reviewObservables).subscribe({
      next: (updatedDoctors: UserDto[]) => {
        this.doctors = updatedDoctors;
        this.filteredDoctors = this.doctors;
        this.sortDoctors(); // Ensure doctors are sorted after loading reviews
      },
      error: (error: any) => {
        console.error('There was an error fetching the reviews', error);
      }
    });
  }

  extractSpecializations(): void {
    const specializationsSet = new Set<string>();
    this.doctors.forEach(doctor => {
      if (doctor.description) {
        const specialization = doctor.description.replace('Specialist în ', '');
        specializationsSet.add(specialization);
      }
    });
    this.specializations = Array.from(specializationsSet);
  }

  filterDoctors(): void {
    this.filteredDoctors = this.doctors.filter(doctor => {
      const matchesCity = this.selectedCity ? doctor.address?.includes(this.selectedCity) : true;
      const matchesSpecialization = this.selectedSpecialization ? doctor.description?.includes(this.selectedSpecialization) : true;
      return matchesCity && matchesSpecialization;
    });
    this.sortDoctors();
  }

  sortDoctors(): void {
    this.filteredDoctors.sort((a, b) => {
      const aAvgRating = a.averageRating || 0;
      const bAvgRating = b.averageRating || 0;
      const aReviewCount = a.reviewCount || 0;
      const bReviewCount = b.reviewCount || 0;

      if (this.selectedSortOrder === 'asc') {
        return aAvgRating - bAvgRating;
      } else if (this.selectedSortOrder === 'desc') {
        return bAvgRating - aAvgRating;
      } else if (this.selectedSortReviewCountOrder === 'asc') {
        return aReviewCount - bReviewCount;
      } else {
        return bReviewCount - aReviewCount;
      }
    });
  }

  scheduleAppointment(doctorUsername: string): void {
    const currentUserJson = localStorage.getItem('currentUser');
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
    const patientUsername = currentUser?.username;

    this.router.navigate(['/appointment/add'], { queryParams: { doctorUsername, patientUsername } });
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
      voteType: ''
    };
    this.responseComment = '';
  }

  submitReview(): void {
    const currentUserJson = localStorage.getItem('currentUser');
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
  
    if (currentUser) {
      this.newReview.patientId = currentUser.userId;
      this.newReview.createdAt = new Date();
  
      const reviewToSubmit: ReviewDto = { ...this.newReview };
  
      if (this.responseComment && this.responseComment.trim() !== '') {
        reviewToSubmit.responseComment = this.responseComment;
      } else {
        delete reviewToSubmit.responseComment;
      }
  
      this.reviewService.addReview(reviewToSubmit).subscribe(
        (review: ReviewDto) => {
          console.log('Review submitted successfully', review);
          this.loadDoctors();
          this.loadReviews(this.newReview.doctorId);
          // this.closeReviewModal();
        },
        (error: any) => {
          console.error('Failed to submit review', error);
          if (error.status === 400) {
            alert('Validation error. Please check your input.');
          }
        }
      );
    }
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
        console.log('Reviews loaded:', this.reviews); // Debug log
        console.log('Star Ratings:', this.starRatings); // Debug log
        console.log('Average Rating:', this.averageRating); // Debug log
      },
      error: (error) => {
        console.error('Failed to load reviews', error);
      }
    });
  }
  

  updateStarRatings(): void {
    const starCounts = [0, 0, 0, 0, 0];
    const totalReviews = this.reviews.length;
  
    this.reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        starCounts[5 - review.rating]++;
      }
    });
  
    this.starRatings = starCounts.map((count, index) => ({
      stars: `${5 - index}`,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
      count: count
    }));
  }
  

  setRating(star: number): void {
    this.newReview.rating = star;
  }

  calculateAverageRating(): void {
    if (this.reviews.length > 0) {
      const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      this.averageRating = totalRating / this.reviews.length;
    } else {
      this.averageRating = 0;
    }
  }
  

  calculateDoctorAverageRating(doctorReviews: ReviewDto[]): number {
    if (doctorReviews.length === 0) return 0;
    const totalRating = doctorReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / doctorReviews.length;
  }

  getDoctorReviewCount(doctorId: number): number {
    return this.reviews.filter(review => review.doctorId === doctorId).length;
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
        error: (error: any) => console.error('Failed to update helpful count', error)
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
        error: (error: any) => console.error('Failed to update not helpful count', error)
      });
    }
  }

  deleteReview(review: ReviewDto): void {
    const currentUserJson = localStorage.getItem('currentUser');
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
  
    if (currentUser) {
      const isAdmin = currentUser.roleId === 3;
      const isOwner = currentUser.userId === review.patientId;
  
      if (isAdmin || isOwner) {
        this.reviewService.deleteReview(review.reviewId).subscribe({
          next: () => {
            console.log('Review deleted successfully');
            this.reviews = this.reviews.filter(r => r.reviewId !== review.reviewId);
            this.loadDoctors();
          },
          error: (error: any) => {
            console.error('Failed to delete review', error);
            this.reviews = this.reviews.filter(r => r.reviewId !== review.reviewId);
            this.loadDoctors();
          }
        });
      } else {
        alert("You don't have permission to delete this review.");
      }
    } else {
      console.error('No user logged in');
    }
  }

  canDeleteReview(review: ReviewDto): boolean {
    const currentUserJson = localStorage.getItem('currentUser');
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
  
    if (currentUser) {
      const isAdmin = currentUser.roleId === 3;
      const isOwner = currentUser.userId === review.patientId;
      return isAdmin || isOwner;
    }
  
    return false;
  }  

  isHelpfulButtonDisabled(review: ReviewDto): boolean {
    const currentUserJson = localStorage.getItem('currentUser');
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
    return currentUser ? review.voteType === 'helpful' : false;
  }

  isNotHelpfulButtonDisabled(review: ReviewDto): boolean {
    const currentUserJson = localStorage.getItem('currentUser');
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
    return currentUser ? review.voteType === 'not-helpful' : false;
  }

  sortReviews(event: Event): void {
    const target = event.target as HTMLSelectElement | null;

    if (target) {
      const criteria = target.value;

      if (criteria === 'relevant') {
        this.reviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
      } else if (criteria === 'recent') {
        this.reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } else {
      console.error('Event target is not an HTMLSelectElement:', event.target);
    }
  }

  editDescription(doctor: UserDto): void {
    if (doctor.userId !== undefined) {
      this.editingDescriptionId = doctor.userId;
      this.newDescription = doctor.description || '';
    }
  }

  saveDescription(doctor: UserDto): void {
    if (doctor.userId !== undefined) {
      this.userService.updateDescription(doctor.userId, this.newDescription).subscribe({
        next: (updatedDoctor: UserDto) => {
          console.log('Description updated successfully', updatedDoctor);
          this.editingDescriptionId = null;
          this.newDescription = '';
          this.loadDoctors();
          alert("Description was saved!");
        },
        error: (error: any) => {
          console.error('Failed to update description', error);
          alert("Description was not saved!");
        }
      });
    }
  }
}
