export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  status: 'draft' | 'published';
  viewCount: number;
  likeCount: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
  htmlContent?: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: File;
  tags?: string[];
  status?: 'draft' | 'published';
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: File;
  tags?: string[];
  status?: 'draft' | 'published';
}

export interface PostFilters {
  search?: string;
  tag?: string;
  author?: string;
  status?: 'draft' | 'published';
  sortBy?: 'newest' | 'oldest' | 'popular';
  page?: number;
  limit?: number;
}

export interface PostsResponse {
  success: boolean;
  data: Post[];
  count: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

export interface PostResponse {
  success: boolean;
  data: Post;
}
