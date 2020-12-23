import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { fromEvent, observable, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';

import { BlogPostHeader } from '../interfaces/blog-post-header';
import { PaginatedPostHeaders } from '../interfaces/paginated-post-headers';
import { BlogPostService } from '../services/blog-post.service';

@Component({
  selector: 'app-blog-post-list',
  templateUrl: './blog-post-list.component.html',
  styleUrls: ['./blog-post-list.component.css'],
})
export class BlogPostListComponent implements OnInit, OnChanges {
  @Input() filterByAuthor: boolean = false;
  @Input() pageSize: number = 10;
  @Input() showPaginationLinks: boolean = true;
  resultsHeaderTitle: string;
  pageNumber: number = 0;
  totalItems: number;
  totalPages: number;
  posts: BlogPostHeader[];
  isLoading: boolean;
  errorMessage: string;
  @ViewChild('postSearchInput') postSearchInput: ElementRef;

  constructor(private blogPostService: BlogPostService) {}

  ngOnInit(): void {
    const startingPageNumber: number = 0;

    if (this.filterByAuthor) {
      this.getAuthorPosts(startingPageNumber);
    } else {
      this.getAllPosts(startingPageNumber);
    }

    this.setupSearchPostsByTitle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.posts) {
      this.resultsHeaderTitle = this.getResultsHeaderTitle();
    }
  }

  getAllPosts(pageNumber: number): Observable<PaginatedPostHeaders> {
    this.errorMessage = '';
    this.isLoading = true;

    const observable: Observable<PaginatedPostHeaders> = this.blogPostService.getAllPosts(
      pageNumber,
      this.pageSize
    );

    observable.subscribe(
      (data: PaginatedPostHeaders) => {
        this.isLoading = false;
        this.posts = data.posts;
        this.pageNumber = pageNumber;
        this.totalItems = data.totalItems;
        this.totalPages = Math.ceil(data.totalItems / this.pageSize);
      },
      (error: Error) => {
        this.isLoading = false;
        this.errorMessage = error.message;
      }
    );

    return observable;
  }

  getAuthorPosts(pageNumber: number): Observable<PaginatedPostHeaders> {
    this.isLoading = true;
    this.errorMessage = '';

    const observable: Observable<PaginatedPostHeaders> = this.blogPostService.getAuthorPosts(
      pageNumber,
      this.pageSize
    );
    observable.subscribe(
      (data: PaginatedPostHeaders) => {
        this.posts = data.posts;
        this.pageNumber = pageNumber;
        this.totalItems = data.totalItems;
        this.totalPages = Math.ceil(data.totalItems / this.pageSize);
      },
      (error: Error) => (this.errorMessage = error.message)
    );

    return observable;
  }

  setupSearchPostsByTitle(): void {
    fromEvent(this.postSearchInput.nativeElement, 'keyup')
      .pipe(
        // Get the value
        map((event: any) => event.target.value),
        // filter all values that have a length of 2 or less
        filter((value: string) => value.length > 2),
        // Time Between key events
        debounceTime(1000),
        // Insures that current query is different than previous query
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        this.errorMessage = '';
        this.isLoading = true;

        this.blogPostService.searchPostsByTitle(text).subscribe(
          (data: BlogPostHeader[]) => {
            this.isLoading = false;
            this.posts = data;
            this.pageNumber = -1;
            this.totalPages = -1;
            this.totalItems = -1;
          },
          (error: Error) => {
            this.isLoading = false;
            this.errorMessage = error.message;
          }
        );
      });
  }

  getPage(pageNumber: number): void {
    if (pageNumber < 0 || pageNumber > this.totalPages) {
      throw new Error(
        `The page number ${pageNumber}, is invalid. The total number of pages is ${this.totalPages}.`
      );
    }

    if (this.filterByAuthor) {
      this.getAuthorPosts(pageNumber);
    } else {
      this.getAllPosts(pageNumber);
    }
  }

  nextPage(pageNumber: number): void {
    this.getPage(pageNumber + 1);
  }

  previousPage(pageNumber: number): void {
    this.getPage(pageNumber - 1);
  }

  getResultsHeaderTitle(): string {
    if (this.isLoading) {
      return 'Loading...';
    } else if (this.errorMessage) {
      return 'Error';
    } else {
      return `${this.posts.length} Posts`;
    }
  }
}
