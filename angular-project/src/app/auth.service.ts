import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


interface AuthResponse {
  access: string;
  refresh?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Django backend base URL
  private readonly tokenKey: string = 'access';
  private readonly refreshTokenKey: string = 'refresh';


  constructor(private http: HttpClient) {}

  getApiUrl(): string {
  return this.apiUrl;
}

  // ✅ Register user
  register(data: { username: string; email: string; password: string; password_confirm: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  // ✅ Login
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/token/`, { username, password });
  }

  // ✅ Save tokens to localStorage
  saveToken(access: string, refresh?: string): void {
    localStorage.setItem('access', access);
    if (refresh) {
      localStorage.setItem('refresh', refresh);
    }
  }

  // ✅ Get access token
  getToken(): string | null {
    return localStorage.getItem('access');
  }

  // ✅ Get categories (dashboard)
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/`);
  }

  // ✅ Get items (dashboard)
  getItems(params: any = {}): Observable<any> {
    return this.http.get(`${this.apiUrl}/items/`, { params });
  }

  

  viewItem(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/items/${id}/view/`);
}

  editItem(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/items/${id}/`, data);
  }


  // ✅ Logout
  logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }
    
  // ✅ Check login
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access');
  }
   
  addcategories(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/add-category/`, data); // ✅ Exact match
  }

  addItem(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-item/`, data);
  }

  fetchItemsByCategory(categoryId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/items/?category_id=${categoryId}`);
}

submitStockTransaction(payload: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/stock-add-reduce/`, payload);
}

 getTransactions(): Observable<any> {
  return this.http.get(`${this.apiUrl}/stock-transactions/`);
}
}
