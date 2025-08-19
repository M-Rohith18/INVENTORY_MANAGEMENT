import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  fieldErrors: any = {};
  nonFieldError = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_confirm: ['', Validators.required],
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.fieldErrors = {};
    this.nonFieldError = '';
    this.successMessage = '';

    this.http.post<any>('http://localhost:8000/api/register/', this.registerForm.value).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        if (err.status === 400) {
          if (err.error.non_field_errors) {
            this.nonFieldError = err.error.non_field_errors[0];
          }
          this.fieldErrors = err.error;
        }
      }
    });
  }
}
