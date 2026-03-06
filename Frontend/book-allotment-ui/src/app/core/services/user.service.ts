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

  // 🔹 Admin User Management API
  private adminBaseUrl = 'https://localhost:7278/api/admin/users';

  // 🔹 Allotment API
  private allotmentUrl = 'https://localhost:7278/api/allotments';

  // 🔹 Auth API (Profile related)
  private authUrl = 'https://localhost:7278/api/auth';

  constructor(private http: HttpClient) {}

  // 🔐 Attach JWT Token
  private getAuthHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // ==========================================
  // ✅ ADMIN → USER MANAGEMENT
  // ==========================================

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(
      this.adminBaseUrl,
      this.getAuthHeaders()
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(
      `${this.adminBaseUrl}/${id}`,
      this.getAuthHeaders()
    );
  }

  addUser(user: any) {
    return this.http.post(
      this.adminBaseUrl,
      user,
      this.getAuthHeaders()
    );
  }

  updateUser(id: number, user: any) {
    return this.http.put(
      `${this.adminBaseUrl}/${id}`,
      user,
      this.getAuthHeaders()
    );
  }

  deleteUser(id: number) {
    return this.http.delete(
      `${this.adminBaseUrl}/${id}`,
      this.getAuthHeaders()
    );
  }

  // ==========================================
  // ✅ USER → ACTIVITY
  // ==========================================

  getMyActivity(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.allotmentUrl}/my-activity`,
      this.getAuthHeaders()
    );
  }

  // ==========================================
  // ✅ USER → PROFILE
  // ==========================================

  getProfile(): Observable<User> {
    return this.http.get<User>(
      `${this.authUrl}/me`,
      this.getAuthHeaders()
    );
  }

  updateProfile(data: any) {
    return this.http.put(
      `${this.authUrl}/update-profile`,
      data,
      this.getAuthHeaders()
    );
  }

}