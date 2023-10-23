import { Book } from "app/models/book";
import { DataService } from "./data.service";
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from "@angular/core/testing";
import { BookTrackerError } from "app/models/bookTrackerError";

describe('DataService tests', () => {

    let dataService: DataService;
    let httpTestingController: HttpTestingController;

    let testBooks: Book[] = [
        {
            "bookID": 4,
            "title": "The Hobbit",
            "author": "J. R. R. Tolkien",
            "publicationYear": 1937
        },
        {
            "bookID": 5,
            "title": "Curious George",
            "author": "H. A. Rey",
            "publicationYear": 1941
        },
        {
            "bookID": 6,
            "title": "Alice's Adventures in Wonderland",
            "author": "Lewis Carroll",
            "publicationYear": 1865
        }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [ DataService ]
        });

        dataService = TestBed.inject(DataService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should GET all books', () => {
        dataService.getAllBooks()
            .subscribe((data: Book[] | BookTrackerError) => {
                expect((<Book[]>data).length).toBe(3);
            });
        
        let booksReq: TestRequest = httpTestingController.expectOne('api/books');
        expect(booksReq.request.method).toEqual('GET');

        booksReq.flush(testBooks);
    });

    it('should return a BookTrackerError', () => {
        dataService.getAllBooks()
            .subscribe(
                (data: Book[] | BookTrackerError) => fail('This should have been an error.'),
                (err: BookTrackerError) => {
                    expect(err.errorNumber).toEqual(100);
                    expect(err.friendlyMessage).toEqual('An error occurred while retrieving data.');
                    expect(err.message).toEqual('Server error');
                }
            );
        
        let booksReq: TestRequest = httpTestingController.expectOne('api/books');
        
        booksReq.flush('error', {
            status: 500,
            statusText: 'Server error'
        })
    });
});