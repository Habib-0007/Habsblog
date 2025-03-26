'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, FileText } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useUserDrafts, useDeletePost } from '../../hooks/usePosts';
import { formatDate } from '../../lib/utils';

const UserDrafts = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useUserDrafts(page);
  const { mutate: deletePost } = useDeletePost();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
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

  if (isError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't load your drafts. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold gradient-text">Your Drafts</h1>
        <Link to="/posts/create">
          <Button
            className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Post
          </Button>
        </Link>
      </div>

      {data?.data.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No drafts yet</h2>
          <p className="text-muted-foreground mb-6">
            You don't have any draft posts. Start writing something new!
          </p>
          <Link to="/posts/create">
            <Button
              className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create New Post
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {data?.data.map((post: any) => (
              <Card key={post._id} className="p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                    <p className="text-muted-foreground mb-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Last updated: {formatDate(post.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
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
                      onClick={() => handleDelete(post._id)}
                      leftIcon={<Trash2 className="w-4 h-4" />}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {data && data.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
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
        </>
      )}
    </div>
  );
};

export default UserDrafts;
