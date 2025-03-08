import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReviewsService, ReviewType } from '@interiordesigner/reviews-client';
import { Review } from '@interiordesigner/reviews-client';
import { Configuration } from '@interiordesigner/reviews-client';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule
  ],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {
  reviews: Review[] = [];
  filters = {
    serviceId: '',
    clientId: '',
    reviewType: ReviewType.Client
  };

  constructor(private reviewsService: ReviewsService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewsService.apiReviewsGet(
      this.filters.serviceId,
      this.filters.clientId,
      this.filters.reviewType
    ).subscribe({
      next: (data) => this.reviews = data,
      error: (error) => console.error('Error fetching reviews:', error)
    });
  }

  applyFilters(): void {
    this.loadReviews();
  }
}