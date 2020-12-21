import { BlogPostHeader } from './blog-post-header';

export interface PaginatedPostHeaders {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  posts: BlogPostHeader[];
}
