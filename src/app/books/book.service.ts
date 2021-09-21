import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Book, BookId } from './book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }
// Tüm backend isteklerinin yapıldı yer, api metotlarının yazılması
  findAll(): Observable<Array<Book>> {
    return this.http.get<Array<Book>>(`${environment.api}/books`);
  }

  findById(id: string): Observable<Book> {
    return this.http.get<Book>(`${environment.api}/books/${id}`);
  }

  create(book: Omit<Book, BookId>): Observable<Book> {
    return this.http.post<Book>(`${environment.api}/books`, book);
  }

  update(book: Book): Observable<Book> {
    const { _id, ...fieldsToUpdate } = book;
    return this.http.put<Book>(`${environment.api}/books/${_id}`, fieldsToUpdate);
  }

  partialUpdate(id: string, book: Partial<Book>): Observable<Book> {
    const { _id, ...fieldsToUpdate } = book;
    return this.http.patch<Book>(`${environment.api}/books/${id}`, fieldsToUpdate);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${environment.api}/books/${id}`);
  }

  getRamdomPosterImgPath(): string {
    const randomIdFrom1To500 = Math.floor((Math.random() * 500) + 1);
    return `https://i.picsum.photos/id/${randomIdFrom1To500}/200/200.jpg`;
  }
}
