

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAdminComments } from '../../hooks/useAdmin';
import { useDeleteComment } from '../../hooks/useComments';
import { formatDate } from '../../lib/utils';

const Comments = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAdminComments(page);
  const { mutate: deleteComment } = useDeleteComment();

  const handleDeleteComment = (id: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this comment? This action cannot be undone.',
      )
    ) {
      deleteComment(id);
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
          We couldn't load the comments. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 gradient-text">Manage Comments</h1>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2">Content</th>
                <th className="text-left py-2">Author</th>
                <th className="text-left py-2">Post</th>
                <th className="text-center py-2">Likes</th>
                <th className="text-left py-2">Date</th>
                <th className="text-right py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((comment: any) => (
                <tr key={comment._id} className="border-b border-border">
                  <td className="py-3 max-w-xs">
                    <div className="truncate">{comment.content}</div>
                  </td>
                  <td className="py-3">{comment.author.name}</td>
                  <td className="py-3">
                    <Link
                      to={`/posts/${comment.post._id}`}
                      className="hover:text-primary truncate max-w-[150px] inline-block"
                    >
                      {comment.post.title}
                    </Link>
                  </td>
                  <td className="py-3 text-center">{comment.likeCount}</td>
                  <td className="py-3">{formatDate(comment.createdAt)}</td>
                  <td className="py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteComment(comment._id)}
                      leftIcon={<Trash2 className="w-4 h-4" />}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
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

export default Comments;
