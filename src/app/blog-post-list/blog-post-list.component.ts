import { Component, Input, OnInit } from '@angular/core';
import { observable, Observable } from 'rxjs';

import { BlogPostHeader } from '../interfaces/blog-post-header';
import { PaginatedPostHeaders } from '../interfaces/paginated-post-headers';
import { BlogPostService } from '../services/blog-post.service';

@Component({
  selector: 'app-blog-post-list',
  templateUrl: './blog-post-list.component.html',
  styleUrls: ['./blog-post-list.component.css'],
})
export class BlogPostListComponent implements OnInit {
  @Input() filterByAuthor: boolean = false;
  @Input() pageSize: number = 10;
  @Input() showPaginationLinks: boolean = true;
  pageNumber: number = 0;
  totalItems: number;
  totalPages: number;
  posts: BlogPostHeader[];
  isSearching: boolean;
  searchQuery: string;

  constructor(private blogPostService: BlogPostService) {}

  ngOnInit(): void {
    if (this.filterByAuthor) {
      this.getAuthorPosts(this.pageNumber);
    } else {
      this.getAllPosts(this.pageNumber);
    }
  }

  getAllPosts(pageNumber: number): Observable<PaginatedPostHeaders> {
    const observable: Observable<PaginatedPostHeaders> = this.blogPostService.getAllPosts(
      pageNumber,
      this.pageSize
    );
    observable.subscribe((data: PaginatedPostHeaders) => {
      this.posts = data.posts;
      this.pageNumber = pageNumber;
      this.totalItems = data.totalItems;
      this.totalPages = Math.ceil(data.totalItems / this.pageSize);
    });
    return observable;
  }

  getAuthorPosts(pageNumber: number): Observable<PaginatedPostHeaders> {
    const observable: Observable<PaginatedPostHeaders> = this.blogPostService.getAuthorPosts(
      pageNumber,
      this.pageSize
    );
    observable.subscribe((data: PaginatedPostHeaders) => {
      this.posts = data.posts;
      this.pageNumber = pageNumber;
      this.totalItems = data.totalItems;
      this.totalPages = Math.ceil(data.totalItems / this.pageSize);
    });
    return observable;
  }

  searchPostsByTitle(
    title: string,
    pageNumber: number = 0
  ): Observable<PaginatedPostHeaders> {
    this.isSearching = true;
    this.searchQuery = title;

    const observable: Observable<PaginatedPostHeaders> = this.blogPostService.searchPostsByTitle(
      title,
      pageNumber,
      this.pageSize
    );
    observable.subscribe((data: PaginatedPostHeaders) => {
      this.posts = data.posts;
      this.pageNumber = pageNumber;
      this.totalItems = data.totalItems;
      this.totalPages = Math.ceil(data.totalItems / this.pageSize);
    });
    return observable;
  }

  getPage(pageNumber: number): void {
    if (pageNumber < 0 || pageNumber > this.totalPages) {
      throw new Error(
        `The page number ${pageNumber}, is invalid. The total number of pages is ${this.totalPages}.`
      );
    }

    if (this.filterByAuthor) {
      this.getAuthorPosts(pageNumber);
    } else if (this.isSearching) {
      this.searchPostsByTitle(this.searchQuery, pageNumber);
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
}
