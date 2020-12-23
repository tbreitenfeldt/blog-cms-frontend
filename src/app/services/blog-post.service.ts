import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  retry,
} from 'rxjs/operators';

import { PaginatedPostHeaders } from '../interfaces/paginated-post-headers';
import { BlogPost } from '../interfaces/blog-post';
import { BlogPostRequest } from '../interfaces/blog-post-request';
import { BlogPostHeader } from '../interfaces/blog-post-header';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  SERVER_URL: string = 'http://localhost:8080/api';

  constructor(
    private httpClient: HttpClient,
    @Inject('api_url') private apiUrl: string
  ) {}

  getAllPosts(
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedPostHeaders> {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.httpClient.get<PaginatedPostHeaders>(
      `${this.apiUrl}/api/posts`,
      {
        params: params,
      }
    );
  }

  getAuthorPosts(
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedPostHeaders> {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.httpClient.get<PaginatedPostHeaders>(
      `${this.apiUrl}/api/author/posts`,
      {
        params: params,
      }
    );
  }

  searchPostsByTitle(title: string): Observable<BlogPostHeader[]> {
    let params = new HttpParams();
    params = params.append('title', title);
    return this.httpClient.get<BlogPostHeader[]>(
      `${this.apiUrl}/api/posts/search`,
      {
        params: params,
      }
    );
  }

  getBlogPost(id: number): Observable<BlogPost> {
    return this.httpClient.get<BlogPost>(`${this.apiUrl}/api/posts/${id}`);
  }

  createBlogPost(blogPost: BlogPostRequest): Observable<BlogPost> {
    return this.httpClient.post<BlogPost>(`${this.apiUrl}/api/posts`, blogPost);
  }

  updateBlogPost(id: number, blogPost: BlogPostRequest): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/api/posts/${id}`, blogPost);
  }

  deleteBlogPost(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/api/posts/${id}`);
  }
}
