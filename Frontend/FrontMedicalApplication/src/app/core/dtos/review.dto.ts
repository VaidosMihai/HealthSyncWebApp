export interface ReviewDto {
  reviewId: number;
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
  voteType?: 'helpful' | 'not-helpful' | '';
}
