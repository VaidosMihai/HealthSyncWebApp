export interface ReviewDto {
  reviewId: number; // Make reviewId non-optional
  doctorId: number;
  patientId: number;
  rating: number;
  comment: string;
  createdAt: Date;
  helpfulCount: number;
  notHelpfulCount: number;
  responseComment?: string;
  patientName?: string;
  doctorName?: string;
  voteType?: 'helpful' | 'not-helpful' | ''; // New property
}
