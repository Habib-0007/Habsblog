export interface Comment {
  _id: string;
  content: string;
  post: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  parent?: string;
  images?: string[];
  likeCount: number;
  likedBy: string[];
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface CreateCommentData {
  content: string;
  postId: string;
  parentId?: string;
  images?: File[];
}

export interface UpdateCommentData {
  content: string;
  images?: File[];
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

export interface CommentResponse {
  success: boolean;
  data: Comment;
}
