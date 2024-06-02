import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewService } from './review-service.service';
import { ReviewDto } from '../dtos/review.dto';
import { environment } from '../../../environments/environment';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewService]
    });
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get reviews by doctor ID', () => {
    const mockReviews: ReviewDto[] = [{ reviewId: 1, doctorId: 1, patientId: 1, rating: 5, comment: 'Great doctor!', createdAt: new Date(), helpfulCount: 0, notHelpfulCount: 0 }];

    service.getReviewsByDoctorId(1).subscribe(reviews => {
      expect(reviews).toEqual(mockReviews);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/review/doctor/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReviews);
  });

  it('should get reviews by patient ID', () => {
    const mockReviews: ReviewDto[] = [{ reviewId: 1, doctorId: 1, patientId: 1, rating: 5, comment: 'Great doctor!', createdAt: new Date(), helpfulCount: 0, notHelpfulCount: 0 }];

    service.getReviewsByPatientId(1).subscribe(reviews => {
      expect(reviews).toEqual(mockReviews);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/review/patient/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReviews);
  });

  it('should get reviews by author patient ID', () => {
    const mockReviews: ReviewDto[] = [{ reviewId: 1, doctorId: 1, patientId: 1, rating: 5, comment: 'Great doctor!', createdAt: new Date(), helpfulCount: 0, notHelpfulCount: 0 }];

    service.getReviewsByAuthorPatientId(1).subscribe(reviews => {
      expect(reviews).toEqual(mockReviews);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/review/author/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReviews);
  });

  it('should add a review', () => {
    const mockReview: ReviewDto = { reviewId: 1, doctorId: 1, patientId: 1, rating: 5, comment: 'Great doctor!', createdAt: new Date(), helpfulCount: 0, notHelpfulCount: 0 };

    service.addReview(mockReview).subscribe(review => {
      expect(review).toEqual(mockReview);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/review');
    expect(req.request.method).toBe('POST');
    req.flush(mockReview);
  });

  it('should update review helpful count', () => {
    service.updateReviewHelpfulCount(1, 1).subscribe(response => {
      expect(response).toEqual();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/review/1/helpful?userId=1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should update review not helpful count', () => {
    service.updateReviewNotHelpfulCount(1, 1).subscribe(response => {
      expect(response).toEqual();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/review/1/not-helpful?userId=1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should add a response comment', () => {
    const mockReview: ReviewDto = { reviewId: 1, doctorId: 1, patientId: 1, rating: 5, comment: 'Great doctor!', createdAt: new Date(), helpfulCount: 0, notHelpfulCount: 0, responseComment: 'Thank you!' };

    service.addResponseComment(1, 'Thank you!').subscribe(review => {
      expect(review).toEqual(mockReview);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/review/1/response`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockReview);
  });

  it('should delete a review', () => {
    service.deleteReview(1).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/review/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
