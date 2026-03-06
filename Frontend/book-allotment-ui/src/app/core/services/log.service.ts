import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookLog {
  id: number;
  bookTitle: string;
  userName?: string;
  userEmail?: string;
  allotDate: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private allotUrl = 'https://localhost:7278/api/allotments';
  private requestUrl = 'https://localhost:7278/api/requests';

  constructor(private http: HttpClient) {}

  // 🔥 Add token automatically
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // ==========================
  // ADMIN - Get all allotments
  // ==========================
  getAllLogs(): Observable<BookLog[]> {
    return this.http.get<BookLog[]>(
      this.allotUrl,
      this.getHeaders()
    );
  }

  // ==========================
  // USER - Get my books
  // ==========================
  getMyLogs(): Observable<BookLog[]> {
    return this.http.get<BookLog[]>(
      `${this.allotUrl}/my`,
      this.getHeaders()
    );
  }

  // ==========================
  // USER - Request book
  // ==========================
  requestBook(bookId: number) {
    return this.http.post(
      `${this.requestUrl}/${bookId}`,
      {},
      this.getHeaders()
    );
  }

  // ==========================
  // ADMIN - Revoke book
  // ==========================
  revokeBook(id: number) {
    return this.http.post(
      `${this.allotUrl}/revoke/${id}`,
      {},
      this.getHeaders()
    );
  }
 
}