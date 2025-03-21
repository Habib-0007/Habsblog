'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Calendar, Eye, ThumbsUp, Edit, Trash2, X } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { postApi } from '../../api/postApi';
import LoadingPage from '../../components/common/LoadingPage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PostsPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'posts', page, limit],
    queryFn: () => adminApi.getPosts(page, limit),
    // keepPreviousData: true,
  });

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => postApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
      toast.success('Post deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedPost(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete post');
    },
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDeleteModal = (postId: string) => {
    setSelectedPost(postId);
    setIsDeleteModalOpen(true);
  };

  const handleDeletePost = () => {
    if (selectedPost) {
      deletePostMutation.mutate(selectedPost);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
          Failed to load posts. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-heading mb-8">Manage Posts</h1>

      <div className="card">
        <div className="card-header flex justify-between items-center">
          <h2 className="card-title">All Posts</h2>
          <div className="text-sm text-muted-foreground">
            Total: {data?.data.length || 0} posts
          </div>
        </div>

        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Author</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Views</th>
                  <th className="text-center py-3 px-4">Likes</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((post: any) => (
                  <tr
                    key={post._id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">
                      <Link
                        to={`/posts/${post._id}`}
                        className="font-medium hover:text-primary"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden mr-2">
                          {post.author.avatar ? (
                            <img
                              src={post.author.avatar || '/placeholder.svg'}
                              alt={post.author.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>{post.author.name.charAt(0)}</span>
                          )}
                        </div>
                        <span>{post.author.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`badge ${
                          post.status === 'published'
                            ? 'badge-primary'
                            : 'badge-outline'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center">
                        <Eye size={14} className="mr-1" />
                        {post.viewCount}
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center">
                        <ThumbsUp size={14} className="mr-1" />
                        {post.likeCount}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(post.createdAt)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/posts/edit/${post._id}`}
                          className="btn btn-sm btn-outline"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(post._id)}
                          className="btn btn-sm btn-outline text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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

      {/* Delete Post Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Delete Post</h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone and will also delete all comments on this post.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="btn btn-primary bg-red-500 hover:bg-red-600"
                disabled={deletePostMutation.isPending}
              >
                {deletePostMutation.isPending ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Deleting...
                  </span>
                ) : (
                  'Delete Post'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
