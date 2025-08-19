import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

interface AuthResponse {
  access: string;
  refresh?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  toastMessage = '';
  toastType: 'success' | 'danger' = 'success';
  showToast = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      // You can rename to 'email' if that's what your backend expects
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!control && control.touched && control.invalid;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response: AuthResponse) => {
        // ✅ Save token
        localStorage.setItem('access', response.access);
        if (response.refresh) {
          localStorage.setItem('refresh', response.refresh);
        }

        // ✅ Show success toast
        this.toastMessage = 'Login successful! Redirecting...';
        this.toastType = 'success';
        this.showToast = true;

        // ✅ Redirect to dashboard
        setTimeout(() => {
          this.showToast = false;
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.toastMessage = err?.error?.detail || 'Login failed. Please try again.';
        this.toastType = 'danger';
        this.showToast = true;
      },
    });
  }

  closeToast(): void {
    this.showToast = false;
  }
}
