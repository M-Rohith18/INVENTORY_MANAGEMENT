import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  standalone: true,
  imports: [CommonModule,RouterModule]
})
export class TransactionListComponent implements OnInit {
  transactions: any[] = [];
  isLoading = true;
  hasError = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getTransactions().subscribe({
      next: (data: any[]) => {
        this.transactions = data;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }
}
