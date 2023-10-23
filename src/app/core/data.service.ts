import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { allBooks, allReaders } from 'app/data';
import { Reader } from "app/models/reader";
import { Book } from "app/models/book";
import { BookTrackerError } from 'app/models/bookTrackerError';
import { OldBook } from 'app/models/oldBook';
import { CONTENT_TYPE } from './add-header.interceptor';
import { CACHEABLE } from './cache.interceptor';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  mostPopularBook: Book = allBooks[0];

  setMostPopularBook(popularBook: Book): void {
    this.mostPopularBook = popularBook;
  }

  getAllReaders(): Observable<Reader[]> {
    // return allReaders;

    console.log('Getting all readers.');
    
    return this.http.get<Reader[]>('api/readers');
  }

  getReaderById(id: number): Observable<Reader> {
    // return allReaders.find(reader => reader.readerID === id);

    const getHeaders: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'my-token2'
    });

    return this.http.get<Reader>(`api/readers/${id}`, {
      headers: getHeaders
    });
  }

  addReader(newReader: Reader): Observable<Reader> {
    const postHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Reader>('api/readers', newReader, {
      headers: postHeaders
    });
  }

  updatedReader(updatedReader: Reader): Observable<void> {
    const putHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<void>(`api/readers/${updatedReader.readerID}`, updatedReader, {
      headers: putHeaders
    });
  }

  deleteReader(readerId: number): Observable<void> {
    return this.http.delete<void>(`api/readers/${readerId}`);
  }

  getAllBooks(): Observable<Book[] | BookTrackerError> {
    // return allBooks;

    console.log('Getting all books.');

    let myContext: HttpContext = new HttpContext();
    myContext.set(CONTENT_TYPE, 'application/xml');
    myContext.set(CACHEABLE, false);

    return this.http.get<Book[]>('api/books', {
      context: myContext
    })
      .pipe(
        catchError(err => this.handleHttpError(err))
      );
  }

  getBookById(id: number): Observable<Book> {
    // return allBooks.find(book => book.bookID === id);
    const getHeaders: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'my-token'
    });

    return this.http.get<Book>(`api/books/${id}`, {
      headers: getHeaders
    });
  }  

  getOldBookById(id: number): Observable<OldBook> {
    return this.http.get<Book>(`api/books/${id}`)
      .pipe(
        map(book => <OldBook>{
          bookTitle: book.title,
          year: book.publicationYear
        }),
        tap(oldBook => console.log(oldBook))
      );
  }

  addBook(newBook: Book): Observable<Book> {
    const postHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Book>('api/books', newBook, {
      headers: postHeaders
    });
  }

  updateBook(updatedBook: Book): Observable<void> {
    const putHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<void>(`api/books/${updatedBook.bookID}`, updatedBook, {
      headers: putHeaders
    });
  }

  deleteBook(bookId: number): Observable<void> {
    return this.http.delete<void>(`api/books/${bookId}`);
  }

  private handleHttpError(error: HttpErrorResponse): Observable<BookTrackerError> {
    let dataError = new BookTrackerError();
    dataError.errorNumber = 100;
    dataError.message = error.statusText;
    dataError.friendlyMessage = 'An error occurred while retrieving data.';

    return throwError(dataError);
  }
  
}
