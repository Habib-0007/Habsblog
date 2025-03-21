'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Calendar, ThumbsUp, Trash2, X } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { commentApi } from '../../api/commentApi';
import LoadingPage from '../../components/common/LoadingPage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CommentsPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'comments', page, limit],
    queryFn: () => adminApi.getComments(page, limit),
    // keepPreviousData: true,
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] });
      toast.success('Comment deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedComment(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete comment');
    },
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDeleteModal = (commentId: string) => {
    setSelectedComment(commentId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteComment = () => {
    if (selectedComment) {
      deleteCommentMutation.mutate(selectedComment);
    }
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

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">
          Failed to load comments. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-heading mb-8">Manage Comments</h1>

      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h2 className="card-title">All Comments</h2>
          <div className="text-sm text-muted-foreground">
            Total: {data?.data.length || 0} comments
          </div>
        </div>

        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Content</th>
                  <th className="text-left py-3 px-4">Author</th>
                  <th className="text-left py-3 px-4">Post</th>
                  <th className="text-center py-3 px-4">Likes</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((comment: any) => (
                  <tr
                    key={comment._id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">
                      <div className="line-clamp-2 max-w-xs">
                        {comment.content}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden mr-2">
                          {comment.author.avatar ? (
                            <img
                              src={comment.author.avatar || '/placeholder.svg'}
                              alt={comment.author.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>{comment.author.name.charAt(0)}</span>
                          )}
                        </div>
                        <span>{comment.author.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/posts/${comment.post}`}
                        className="hover:text-primary"
                      >
                        {comment.post.title
                          ? comment.post.title
                          : `Post ${comment.post}`}
                      </Link>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center">
                        <ThumbsUp size={14} className="mr-1" />
                        {comment.likeCount}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(comment.createdAt)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openDeleteModal(comment._id)}
                        className="btn btn-sm btn-outline text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="btn btn-sm btn-outline"
                >
                  Previous
                </button>

                {Array.from(
                  { length: data.pagination.totalPages },
                  (_, i) => i + 1,
                ).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`btn btn-sm ${
                      pageNum === page ? 'btn-primary' : 'btn-outline'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === data.pagination.totalPages}
                  className="btn btn-sm btn-outline"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Comment Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Delete Comment</h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteComment}
                className="btn btn-primary bg-red-500 hover:bg-red-600"
                disabled={deleteCommentMutation.isPending}
              >
                {deleteCommentMutation.isPending ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Deleting...
                  </span>
                ) : (
                  'Delete Comment'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;
