import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private adminBaseUrl = 'https://localhost:7278/api/admin/users';
  private allotmentUrl = 'https://localhost:7278/api/allotments';
  private authUrl      = 'https://localhost:7278/api/auth';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  // ==========================================
  // ✅ ADMIN → USER MANAGEMENT
  // ==========================================

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.adminBaseUrl, this.getAuthHeaders());
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.adminBaseUrl}/${id}`, this.getAuthHeaders());
  }

  addUser(user: any) {
    return this.http.post(this.adminBaseUrl, user, this.getAuthHeaders());
  }

  updateUser(id: number, user: any) {
    return this.http.put(`${this.adminBaseUrl}/${id}`, user, this.getAuthHeaders());
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.adminBaseUrl}/${id}`, this.getAuthHeaders());
  }

  // ==========================================
  // ✅ USER → ACTIVITY
  // ==========================================

  getMyActivity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.allotmentUrl}/my-activity`, this.getAuthHeaders());
  }

  // ==========================================
  // ✅ USER → PROFILE
  // ==========================================

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.authUrl}/me`, this.getAuthHeaders());
  }

  updateProfile(data: any) {
    return this.http.put(`${this.authUrl}/update-profile`, data, this.getAuthHeaders());
  }

  // ==========================================
  // ✅ ADMIN → PROFILE
  // ==========================================

  getAdminProfile(): Observable<User> {
    return this.http.get<User>(`${this.authUrl}/admin/me`, this.getAuthHeaders());
  }

  updateAdminProfile(data: any) {
    return this.http.put(`${this.authUrl}/admin/update-profile`, data, this.getAuthHeaders());
  }
}
