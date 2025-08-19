import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class CategoryAddComponent {
  categoryForm: FormGroup;
  errors: any = {};
  showToast = false;
  toastMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    this.errors = {};
    this.showToast = false;

    if (this.categoryForm.invalid) return;

    this.authService.addcategories(this.categoryForm.value).subscribe({
      next: (response) => {
        this.toastMessage = response.message || 'Category added successfully!';
        this.showSuccessToast();

        setTimeout(() => {
          this.router.navigate(['/dashboard']); // ✅ Redirect
        }, 2000);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.errors = error.error;
        } else if (error.status === 401) {
          this.errors = { detail: 'Unauthorized. Please login again.' };
          this.authService.logout();
        } else {
          this.errors = { detail: 'Something went wrong. Please try again later.' };
        }
      }
    });
  }

  showSuccessToast() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 1500);
  }
}
