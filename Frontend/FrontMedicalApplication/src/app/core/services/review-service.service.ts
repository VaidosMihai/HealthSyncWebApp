import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReviewDto } from '../dtos/review.dto';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly reviewEndpoint = `${environment.apiUrl}/review`;

  constructor(private http: HttpClient) {}

  getReviewsByDoctorId(doctorId: number): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${this.reviewEndpoint}/doctor/${doctorId}`);
  }

  getReviewsByPatientId(patientId: number): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${this.reviewEndpoint}/patient/${patientId}`);
  }

  getReviewsByAuthorPatientId(patientId: number): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${this.reviewEndpoint}/author/${patientId}`);
  }

  addReview(review: ReviewDto): Observable<ReviewDto> {
    return this.http.post<ReviewDto>(`${this.reviewEndpoint}`, review);
  }

  updateReviewHelpfulCount(review: ReviewDto): Observable<void> {
    return this.http.put<void>(`${this.reviewEndpoint}/${review.reviewId}/helpful`, {});
  }

  updateReviewNotHelpfulCount(review: ReviewDto): Observable<void> {
    return this.http.put<void>(`${this.reviewEndpoint}/${review.reviewId}/not-helpful`, {});
  }

  addResponseComment(reviewId: number, responseComment: string): Observable<ReviewDto> {
    return this.http.put<ReviewDto>(`${this.reviewEndpoint}/${reviewId}/response`, { responseComment });
  }

  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.reviewEndpoint}/${reviewId}`);
  }
}
