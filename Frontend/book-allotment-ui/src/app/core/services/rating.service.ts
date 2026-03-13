import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RatingService {

  private baseUrl = 'https://localhost:7278/api/ratings';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getRatings(bookId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/book/${bookId}`, this.getAuthHeaders());
  }

  submitRating(bookId: number, rating: number, review: string): Observable<any> {
    return this.http.post(this.baseUrl, { bookId, rating, review }, this.getAuthHeaders());
  }
}
