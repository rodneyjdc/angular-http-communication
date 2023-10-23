import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { Book } from "app/models/book";
import { Reader } from "app/models/reader";
import { DataService } from 'app/core/data.service';
import { BookTrackerError } from 'app/models/bookTrackerError';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  allBooks: Book[];
  allReaders: Reader[];
  mostPopularBook: Book;

  constructor(private dataService: DataService,
              private title: Title,
              private route: ActivatedRoute) { }
  
  ngOnInit() {
    // this.dataService.getAllBooks()
    //   .subscribe(
    //     (data: Book[] | BookTrackerError) => this.allBooks = <Book[]>data, // we can cast data because a success will return array of Book
    //     (err: BookTrackerError) => console.log(err), // we are throwing a BookTrackerError object in the error handler
    //     () => console.log('All done getting books.')
    //   );

    let resolvedData: Book[] | BookTrackerError = this.route.snapshot.data['resolvedBooks'];
    if (resolvedData instanceof BookTrackerError) {
      console.log(`Dashboard component error: ${resolvedData.friendlyMessage}`);
    } else {
      console.log('Providing all books to dashboard.')
      this.allBooks = resolvedData;
    }

    this.dataService.getAllReaders()
      .subscribe(
        (data: Reader[]) => {
          this.allReaders = data;
          console.log('List of readers', data);
        },
        (err: any) => console.log(err),
        () => console.log('All done getting readers')
      );
    this.mostPopularBook = this.dataService.mostPopularBook;

    this.title.setTitle(`Book Tracker`);
  }

  deleteBook(bookID: number): void {
    this.dataService.deleteBook(bookID)
      .subscribe(
        (data: void) => {
          let index = this.allBooks.findIndex(book => book.bookID === bookID);
          this.allBooks.splice(index, 1);
        },
        (err: any) => console.log(err)
      );
  }

  deleteReader(readerID: number): void {
    this.dataService.deleteReader(readerID)
      .subscribe(
        (data: void) => {
          console.log('Reader was successfully deleted.');
          this.allReaders = this.allReaders.filter(reader => reader.readerID !== readerID);
        },
        (err: any) => console.log(err)
      );
  }

}
