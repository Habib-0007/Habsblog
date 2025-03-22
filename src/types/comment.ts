import type { User } from './user';

export interface Comment {
  _id: string;
  content: string;
  post: string;
  author: User;
  parent?: string;
  images?: string[];
  likeCount: number;
  likedBy: string[];
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface CommentFilters {
  postId: string;
  parentId?: string;
  page?: number;
  limit?: number;
}

export interface CommentsResponse {
  success: boolean;
  data: Comment[];
  count: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}
