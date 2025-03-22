'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAdminPosts } from '../../hooks/useAdmin';
import { useDeletePost } from '../../hooks/usePosts';
import { formatDate } from '../../lib/utils';

const Posts = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAdminPosts(page);
  const { mutate: deletePost } = useDeletePost();

  const handleDeletePost = (id: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this post? This action cannot be undone.',
      )
    ) {
      deletePost(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't load the posts. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 gradient-text">Manage Posts</h1>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2">Author</th>
                <th className="text-left py-2">Status</th>
                <th className="text-center py-2">Views</th>
                <th className="text-center py-2">Likes</th>
                <th className="text-left py-2">Date</th>
                <th className="text-right py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((post: any) => (
                <tr key={post._id} className="border-b border-border">
                  <td className="py-3">
                    <Link
                      to={`/posts/${post._id}`}
                      className="font-bold hover:text-primary"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="py-3">{post.author.name}</td>
                  <td className="py-3">
                    <Badge
                      variant={
                        post.status === 'published' ? 'default' : 'outline'
                      }
                    >
                      {post.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-center">{post.viewCount}</td>
                  <td className="py-3 text-center">{post.likeCount}</td>
                  <td className="py-3">{formatDate(post.createdAt)}</td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/posts/edit/${post._id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Edit className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePost(post._id)}
                        leftIcon={<Trash2 className="w-4 h-4" />}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="neobrutalism-button px-4 py-2 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="flex items-center px-4 font-bold">
                Page {page} of {data.pagination.totalPages}
              </span>

              <button
                onClick={() =>
                  setPage(Math.min(data.pagination.totalPages, page + 1))
                }
                disabled={page === data.pagination.totalPages}
                className="neobrutalism-button px-4 py-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Posts;
