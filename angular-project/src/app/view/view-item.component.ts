import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-item.component.html'
})
export class ViewItemComponent implements OnInit {
  item: any = null;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Call API (token will be attached by interceptor)
      this.http.get(`http://localhost:8000/api/items/${id}/view/`).subscribe({
        next: (data) => {
          console.log('Item details:', data);
          this.item = data;
        },
        error: (err) => {
          console.error('Failed to load item:', err);
          this.errorMessage = 'Failed to load item details';
        }
      });
    }
  }
}
