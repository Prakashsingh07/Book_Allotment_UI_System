import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminDashboard {
  totalUsers: number;
  totalBooks: number;
  pendingCount: number;
}

export interface LibrarySettings {
  issueDays: number;
  finePerDay: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl      = 'https://localhost:7278/api/dashboard';
  private adminApiUrl = 'https://localhost:7278/api/admin';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getDashboard(filters: any): Observable<AdminDashboard> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params = params.append(key, filters[key]);
    });
    return this.http.get<AdminDashboard>(this.apiUrl, { headers: this.getAuthHeaders(), params });
  }

  getSettings(): Observable<LibrarySettings> {
    return this.http.get<LibrarySettings>(
      `${this.adminApiUrl}/settings`,
      { headers: this.getAuthHeaders() }
    );
  }

  updateSettings(settings: LibrarySettings): Observable<any> {
    return this.http.put(
      `${this.adminApiUrl}/settings`,
      settings,
      { headers: this.getAuthHeaders() }
    );
  }
}
