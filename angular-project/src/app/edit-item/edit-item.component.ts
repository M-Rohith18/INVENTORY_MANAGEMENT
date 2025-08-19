import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-item',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-item.component.html',
})
export class EditItemComponent implements OnInit {
  editItemForm!: FormGroup;
  itemId!: number;
  categories: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Get item ID from route
    this.itemId = Number(this.route.snapshot.paramMap.get('id'));

    // 2. Initialize the form
    this.editItemForm = this.fb.group({
      name: ['', Validators.required],
      unit: ['', Validators.required],
      current_stock: ['', Validators.required],
      category_id: ['', Validators.required],
    });

    // 3. Load categories for dropdown
    this.loadCategories();

    // 4. Load existing item details
    this.loadItemDetails();
  }

  loadCategories() {
    this.http.get<any[]>('http://localhost:8000/api/categories/').subscribe({
      next: data => {
        this.categories = data;
      },
      error: error => {
        console.error('Failed to load categories:', error);
      }
    });
  }

  loadItemDetails() {
    this.http.get<any>(`http://localhost:8000/api/items/${this.itemId}/`).subscribe({
      next: data => {
        this.editItemForm.patchValue({
          name: data.name,
          unit: data.unit,
          current_stock: data.current_stock,
          category_id: data.category_id,  // assuming your backend returns category id
        });
      },
      error: error => {
        console.error('Failed to load item details:', error);
      }
    });
  }

  onSubmit() {
  if (this.editItemForm.invalid) return;

  // Prepare correct payload matching the backend field names
  const payload = {
    name: this.editItemForm.value.name,
    unit: this.editItemForm.value.unit,
    current_stock: this.editItemForm.value.current_stock,
    category_id: this.editItemForm.value.category_id   // ✅ correct field name
  };
  console.log('Submitting payload:', payload); 

  this.http.put(`http://localhost:8000/api/items/${this.itemId}/`, payload).subscribe({
    next: () => {
      alert('Item updated successfully!');
      this.router.navigate(['/dashboard']);
    },
    error: error => {
      console.error('Failed to update item:', error);
      console.error('Error details:', error.error);
    }
  });
}


}
