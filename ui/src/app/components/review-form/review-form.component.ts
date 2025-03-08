import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ReviewsService } from '@interiordesigner/reviews-client';
import { Review } from '@interiordesigner/reviews-client';
@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule
  ],
  template: `
    <div class="review-form-container">
      <h2>Create Review</h2>
      
      <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Service ID</mat-label>
          <input matInput formControlName="serviceId">
          <mat-error *ngIf="reviewForm.get('serviceId')?.errors?.['required']">
            Service ID is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Client ID</mat-label>
          <input matInput formControlName="clientId">
          <mat-error *ngIf="reviewForm.get('clientId')?.errors?.['required']">
            Client ID is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Review Type</mat-label>
          <input matInput formControlName="reviewType">
          <mat-error *ngIf="reviewForm.get('reviewType')?.errors?.['required']">
            Review Type is required
          </mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="!reviewForm.valid">
          Submit Review
        </button>
      </form>
    </div>
  `,
  styles: [`
    .review-form-container {
      padding: 20px;
      max-width: 500px;
      margin: 0 auto;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    button {
      align-self: flex-start;
    }
  `]
})
export class ReviewFormComponent {
  reviewForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      serviceId: ['', Validators.required],
      clientId: ['', Validators.required],
      reviewType: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      console.log(this.reviewForm.value);
    }
  }
}