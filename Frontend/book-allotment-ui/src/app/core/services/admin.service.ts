import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminDashboard {
  totalUsers: number;
  totalBooks: number;
  pendingCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'https://localhost:7278/api/dashboard';

  constructor(private http: HttpClient) {}

  // 🔐 Attach JWT Token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // 📊 Get Dashboard Data (with optional filters)
  getDashboard(filters: any): Observable<AdminDashboard> {

    let params = new HttpParams();

    // ✅ Append filters only if they exist
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    });

    return this.http.get<AdminDashboard>(
      this.apiUrl,
      {
        headers: this.getAuthHeaders(),
        params: params
      }
    );
  }
}