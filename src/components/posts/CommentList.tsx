'use client';

import { useState } from 'react';
import { MessageSquare, ThumbsUp, Reply, Trash2 } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Card from '../ui/Card';
import CommentForm from './CommentForm';
import { formatDate } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';
import { useLikeComment, useDeleteComment } from '../../hooks/useComments';
import type { Comment } from '../../types/comment';

interface CommentListProps {
  comments: Comment[];
  postId: string;
  onCommentUpdate: () => void;
}

const CommentItem = ({
  comment,
  postId,
  onCommentUpdate,
}: {
  comment: Comment;
  postId: string;
  onCommentUpdate: () => void;
}) => {
  const { user } = useAuthStore();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const { mutate: likeComment } = useLikeComment();
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();

  const handleLike = () => {
    likeComment(comment._id, {
      onSuccess: onCommentUpdate,
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(comment._id, {
        onSuccess: onCommentUpdate,
      });
    }
  };

  const isAuthor = user?._id === comment.author?._id;
  const isAdmin = user?.role === 'admin';
  const canDelete = isAuthor || isAdmin;

  return (
    <Card className="mb-4">
      <div className="flex gap-3">
        <Avatar
          src={comment.author?.avatar}
          alt={comment.author?.name}
          size="sm"
        />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-bold">{comment.author?.name}</h4>
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
            </div>

            {canDelete && (
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-2">
            <p>{comment.content}</p>

            {comment.images && comment.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {comment.images.map((image, index) => (
                  <img
                    key={index}
                    src={image || '/placeholder.svg'}
                    alt={`Comment image ${index}`}
                    className="max-w-[100px] max-h-[100px] border-2 border-black"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm ${
                comment.likedBy?.includes(user?._id || '')
                  ? 'text-primary font-bold'
                  : 'text-muted-foreground'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{comment.likeCount || 0}</span>
            </button>

            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 text-sm text-muted-foreground"
            >
              <Reply className="w-4 h-4" />
              <span>Reply</span>
            </button>

            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 text-sm text-muted-foreground"
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {showReplies ? 'Hide' : 'Show'} {comment.replies.length}{' '}
                  {comment.replies.length === 1 ? 'reply' : 'replies'}
                </span>
              </button>
            )}
          </div>

          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                postId={postId}
                parentId={comment._id}
                onSuccess={() => {
                  setShowReplyForm(false);
                  setShowReplies(true);
                  onCommentUpdate();
                }}
              />
            </div>
          )}

          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-muted">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  postId={postId}
                  onCommentUpdate={onCommentUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const CommentList = ({
  comments,
  postId,
  onCommentUpdate,
}: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-6">
        <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
        <h3 className="text-lg font-bold">No comments yet</h3>
        <p className="text-muted-foreground">
          Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          postId={postId}
          onCommentUpdate={onCommentUpdate}
        />
      ))}
    </div>
  );
};

export default CommentList;
