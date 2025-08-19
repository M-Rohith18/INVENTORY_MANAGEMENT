import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddItemComponent {
  addItemForm: FormGroup;
  categories: any[] = [];
  errors: any = {};
  showToast = false;
  toastMessage = '';
  generalError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.addItemForm = this.fb.group({
      name: ['', Validators.required],
      category_id: ['', Validators.required],
      unit: ['', Validators.required],
      description: [''],
      current_stock: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.authService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        this.generalError = 'Failed to load categories.';
      }
    });
  }

  onSubmit(): void {
    this.errors = {};
    this.showToast = false;

    if (this.addItemForm.invalid) return;

    this.authService.addItem(this.addItemForm.value).subscribe({
      next: (res) => {
        this.toastMessage = res.message || 'Item added successfully!';
        this.showSuccessToast();
        this.addItemForm.reset();

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.errors = error.error;
        } else if (error.status === 401) {
          this.errors = { detail: 'Unauthorized. Please login again.' };
          this.authService.logout();
        } else {
          this.errors = { detail: 'Something went wrong. Try again later.' };
        }
      }
    });
  }

  showSuccessToast(): void {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 1500);
  }
}
