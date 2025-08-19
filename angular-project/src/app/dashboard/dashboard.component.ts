import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule],
})
export class DashboardComponent implements OnInit {
  categories: any[] = [];
  items: any[] = [];
  paginatedItems: any[] = [];

  searchTerm = '';
  selectedCategory = '';
  totalCategories = 0;
  lowStockItems = 0;
  showToast = false;
  toastMessage = '';
 
  // Pagination
  pageSize = 5;
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];
  totalItems = 0; // store backend total
  setPagination = false;
  

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadItems();
  }

  loadCategories(): void {
    this.authService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res;
        this.totalCategories = res.length;
      },
      error: () => this.showToastMessage('Failed to load categories.'),
    });
  }

  loadItems(): void {
    const params: any = { 
      ordering: 'category_name',
      page: this.currentPage,
      page_size: this.pageSize
    };

    if (this.selectedCategory) {
      params.category_id = this.selectedCategory;
    }

    // <<< IMPORTANT: send search as item_name (backend expects this)
    const search = this.searchTerm && this.searchTerm.trim();
    if (search) {
      params.item_name = search;
    }

    this.authService.getItems(params).subscribe({
      next: (res: any) => {
        if (res && res.results) {
          // backend paginated response
          this.paginatedItems = res.results;
          this.totalItems = res.count ?? res.results.length;
        } else {
          // fallback if backend not paginating
          this.paginatedItems = Array.isArray(res) ? res : [];
          this.totalItems = this.paginatedItems.length;
        }

        // update counters
        this.lowStockItems = this.paginatedItems.filter(
          (item: any) => item.current_stock < 20
        ).length;

        // update client paging UI
        this.setupPagination();
      },
      error: () => this.showToastMessage('Failed to load items.'),
    });
  }

  setupPagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadItems();
  }

  applyFilters(): void {
    // live search: reset to page 1 and refetch with item_name param
    this.currentPage = 1;
    this.loadItems();
  }

  editItem(id: number): void {
    this.router.navigate(['/items', id, 'edit']);
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.http.delete(`http://localhost:8000/api/items/${id}/delete/`).subscribe({
        next: () => {
          this.showToastMessage('Item deleted successfully.');
          this.loadItems();
        },
        error: () => this.showToastMessage('Item deletion failed.'),
      });
    }
  }

  showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }

  closeToast(): void {
    this.showToast = false;
  }
}
