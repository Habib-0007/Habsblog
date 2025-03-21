'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  Calendar,
  Eye,
  ThumbsUp,
  Tag,
  Edit,
  Trash2,
  MessageSquare,
  X,
} from 'lucide-react';
import { postApi } from '../../api/postApi';
import { commentApi } from '../../api/commentApi';
import { useAuthStore } from '../../stores/authStore';
import type { Comment } from '../../types/comment';
import LoadingPage from '../../components/common/LoadingPage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  const [commentContent, setCommentContent] = useState('');
  const [commentImages, setCommentImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postApi.getPost(id!),
    enabled: !!id,
  });

  const { data: commentsData, isLoading: isLoadingComments } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => commentApi.getComments(id!),
    enabled: !!id,
  });

  const likeMutation = useMutation({
    mutationFn: () => postApi.toggleLikePost(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to like post');
    },
  });

  const commentMutation = useMutation({
    mutationFn: (data: { content: string; postId: string; images?: File[] }) =>
      commentApi.createComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setCommentContent('');
      setCommentImages([]);
      setImagePreviewUrls([]);
      toast.success('Comment added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to add comment');
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: () => postApi.deletePost(id!),
    onSuccess: () => {
      toast.success('Post deleted successfully');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete post');
    },
  });

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Please login to like this post');
      return;
    }

    likeMutation.mutate();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }

    if (!commentContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    commentMutation.mutate({
      content: commentContent,
      postId: id!,
      images: commentImages.length > 0 ? commentImages : undefined,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    if (commentImages.length + newFiles.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }

    setCommentImages((prev) => [...prev, ...newFiles]);

    // Create preview URLs
    const newImagePreviewUrls = newFiles.map((file) =>
      URL.createObjectURL(file),
    );
    setImagePreviewUrls((prev) => [...prev, ...newImagePreviewUrls]);
  };

  const removeImage = (index: number) => {
    setCommentImages((prev) => prev.filter((_, i) => i !== index));

    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Clean up image preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">
          Failed to load post. It may have been deleted or you don't have
          permission to view it.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const post = data.data;
  const isAuthor = user && post.author._id === user.id;
  const isAdmin = user && user.role === 'admin';
  const canEdit = isAuthor || isAdmin;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="mb-12">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Avatar
              src={post.author.avatar}
              alt={post.author.name}
              fallback={post.author.name.charAt(0)}
              className="h-10 w-10 mr-3"
            />
            <div>
              <div className="font-medium">{post.author.name}</div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Calendar size={14} className="mr-1" />
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center text-muted-foreground">
              <Eye size={18} className="mr-1" />
              <span>{post.viewCount} views</span>
            </div>

            <button
              onClick={handleLike}
              className={`flex items-center ${
                user && post.likedBy.includes(user.id)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
              disabled={likeMutation.isPending}
            >
              <ThumbsUp size={18} className="mr-1" />
              <span>{post.likeCount} likes</span>
            </button>

            <div className="flex items-center text-muted-foreground">
              <MessageSquare size={18} className="mr-1" />
              <span>{commentsData?.count || 0} comments</span>
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag: any) => (
                <Link
                  key={tag}
                  to={`/?tag=${tag}`}
                  className="badge badge-outline flex items-center"
                >
                  <Tag size={12} className="mr-1" />
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {canEdit && (
            <div className="flex gap-2 mb-6">
              <Link
                to={`/posts/edit/${post._id}`}
                className="btn btn-sm btn-outline flex items-center"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </Link>
              <button
                onClick={handleDeletePost}
                className="btn btn-sm btn-outline text-red-500 hover:bg-red-500 hover:text-white flex items-center"
                disabled={deletePostMutation.isPending}
              >
                <Trash2 size={16} className="mr-1" />
                {deletePostMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {post.coverImage && (
          <div className="mb-8">
            <img
              src={post.coverImage || '/placeholder.svg'}
              alt={post.title}
              className="w-full h-auto rounded-lg object-cover max-h-96"
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.htmlContent || '' }}
        />
      </article>

      <div className="border-t border-border pt-8 mt-8">
        <h2 className="text-2xl font-bold font-heading mb-6">Comments</h2>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="mb-4">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                className="input min-h-[100px] w-full"
                required
              />
            </div>

            {imagePreviewUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url || '/placeholder.svg'}
                      alt={`Preview ${index + 1}`}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <label className="btn btn-sm btn-outline">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={commentMutation.isPending}
                />
                Add Images (max 3)
              </label>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={commentMutation.isPending}
              >
                {commentMutation.isPending ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Posting...
                  </span>
                ) : (
                  'Post Comment'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-muted p-4 rounded-lg mb-8">
            <p className="text-center mb-2">
              Please login to comment on this post.
            </p>
            <div className="flex justify-center">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            </div>
          </div>
        )}

        {isLoadingComments ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : commentsData?.data.length === 0 ? (
          <div className="text-center py-8 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {commentsData?.data.map((comment: Comment) => (
              <CommentItem key={comment._id} comment={comment} postId={id!} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
  postId: string;
}

const CommentItem = ({ comment, postId }: CommentItemProps) => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const likeMutation = useMutation({
    mutationFn: () => commentApi.toggleLikeComment(comment._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to like comment');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { content: string }) =>
      commentApi.updateComment(comment._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setIsEditing(false);
      toast.success('Comment updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update comment');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => commentApi.deleteComment(comment._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete comment');
    },
  });

  const replyMutation = useMutation({
    mutationFn: (data: { content: string; postId: string; parentId: string }) =>
      commentApi.createComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setReplyContent('');
      toast.success('Reply added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to add reply');
    },
  });

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Please login to like this comment');
      return;
    }

    likeMutation.mutate();
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    updateMutation.mutate({ content: editContent });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteMutation.mutate();
    }
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to reply');
      return;
    }

    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    replyMutation.mutate({
      content: replyContent,
      postId,
      parentId: comment._id,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isAuthor = user && comment.author._id === user.id;
  const isAdmin = user && user.role === 'admin';
  const canEdit = isAuthor || isAdmin;

  return (
    <div className="border-l-4 border-muted pl-4 py-2">
      <div className="flex items-start gap-3">
        <Avatar
          src={comment.author.avatar}
          alt={comment.author.name}
          fallback={comment.author.name.charAt(0)}
          className="h-8 w-8"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="mb-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="input min-h-[80px] w-full mb-2"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn btn-sm btn-primary"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-sm btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-2">{comment.content}</div>
          )}

          {comment.images && comment.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {comment.images.map((image, index) => (
                <a
                  key={index}
                  href={image}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={image || '/placeholder.svg'}
                    alt={`Comment image ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-md"
                  />
                </a>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={handleLike}
              className={`flex items-center ${
                user && comment.likedBy.includes(user.id)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
              disabled={likeMutation.isPending}
            >
              <ThumbsUp size={14} className="mr-1" />
              <span>{comment.likeCount}</span>
            </button>

            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showReplies ? 'Hide Replies' : 'Reply'}
            </button>

            {canEdit && (
              <>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-600"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>

          {showReplies && (
            <div className="mt-4">
              {isAuthenticated && (
                <form onSubmit={handleReply} className="mb-4">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="input min-h-[80px] w-full mb-2"
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
                    disabled={replyMutation.isPending}
                  >
                    {replyMutation.isPending ? 'Posting...' : 'Post Reply'}
                  </button>
                </form>
              )}

              {comment.replies && comment.replies.length > 0 ? (
                <div className="space-y-4 pl-4">
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply._id}
                      comment={reply}
                      postId={postId}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No replies yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
