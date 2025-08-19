import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-reduce',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-reduce.component.html',
  styleUrls: ['./add-reduce.component.css']
})
export class AddReduceComponent implements OnInit {
  transactionForm!: FormGroup;
  categories: any[] = [];
  items: any[] = [];
  showToast = false;
  toastMessage = '';
  isError = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      category: ['', Validators.required],
      item: ['', Validators.required],
      type: ['IN', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]]
    });

    this.getCategories();
  }

  getCategories(): void {
    this.http.get<any[]>(`${this.authService.getApiUrl()}/categories/`).subscribe({
      next: data => {
        this.categories = data;
      },
      error: () => {
        this.showToastMessage('Failed to load categories', true);
      }
    });
  }
  

  onCategoryChange(categoryIdStr: string): void {
  const categoryId = parseInt(categoryIdStr, 10);
  if (!isNaN(categoryId)) {
    this.authService.fetchItemsByCategory(categoryId).subscribe({
      next: (response) => {
        this.items = response.results;  // ← Get actual items
      },
      error: (error) => {
        console.error('Error fetching items by category:', error);
        this.showToastMessage('Failed to load items', true);
      }
    });
  } else {
    this.items = [];
  }
}



  submitTransaction(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    const formData = this.transactionForm.value;

    this.http.post(`${this.authService.getApiUrl()}/stock-add-reduce/`, {
      item: formData.item,
      type: formData.type,
      quantity: formData.quantity
    }).subscribe({
      next: () => {
        this.showToastMessage('Stock updated successfully');
        this.transactionForm.reset({ type: 'IN', quantity: 0 });
        this.items = [];
      },
      error: () => {
        this.showToastMessage('Something went wrong. Try again.', true);
      }
    });
  }

  showToastMessage(message: string, isError = false): void {
    this.toastMessage = message;
    this.isError = isError;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
