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

  private baseUrl      = 'https://localhost:7278/api/requests';
  private allotmentUrl = 'https://localhost:7278/api/allotments';

  constructor(private http: HttpClient) {}

  requestBook(bookId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${bookId}`, {});
  }

  getPending(): Observable<PendingRequest[]> {
    return this.http.get<PendingRequest[]>(`${this.baseUrl}/pending`);
  }

  approve(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/approve/${requestId}`, {});
  }

  reject(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/reject/${requestId}`, {});
  }

  returnBook(id: number): Observable<any> {
    return this.http.post(`${this.allotmentUrl}/return/${id}`, {});
  }

  payFine(allotmentId: number): Observable<any> {
    return this.http.post(`${this.allotmentUrl}/pay-fine/${allotmentId}`, {});
  }
}
