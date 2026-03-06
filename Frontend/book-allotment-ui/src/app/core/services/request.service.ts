import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PendingRequest {
  id: number;
  userName: string;
  bookTitle: string;
  status: string;
  requestDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private baseUrl = 'https://localhost:7278/api/requests';

  constructor(private http: HttpClient) {}

  // 🔹 USER → Request Book
  requestBook(bookId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${bookId}`, {});
  }

  // 🔹 ADMIN → Get Pending Requests
  getPending(): Observable<PendingRequest[]> {
    return this.http.get<PendingRequest[]>(`${this.baseUrl}/pending`);
  }

  // 🔹 ADMIN → Approve Request
  approve(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/approve/${requestId}`, {});
  }

  // 🔹 ADMIN → Reject Request
  reject(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/reject/${requestId}`, {});
  }

  //Return
  returnBook(id: number) {
  return this.http.post(
    `https://localhost:7278/api/allotments/return/${id}`,
    {}
  );
}
}