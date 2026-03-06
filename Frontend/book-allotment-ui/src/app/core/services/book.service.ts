import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  id: number;
  title: string;
  author: string;
  quantity: number | null;
  availableQuantity: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private baseUrl = 'https://localhost:7278/api/books';

  constructor(private http: HttpClient) {}

  // Get all books
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl);
  }
  //get available book
  getAvailableCount() {
  return this.http.get<number>(
    `${this.baseUrl}/available-count`,
    // this.getHeaders()
  );
}

  // Get book by id
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/${id}`);
  }

  // Add new book (Admin)
  addBook(book: any) {
    return this.http.post(this.baseUrl, book);
  }

  // Update book (Admin)
  updateBook(id: number, book: any) {
    return this.http.put(`${this.baseUrl}/${id}`, book);
  }

  // Delete book (Admin)
  deleteBook(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}