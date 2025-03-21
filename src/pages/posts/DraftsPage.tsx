'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Edit, Eye, FileText } from 'lucide-react';
import { postApi } from '../../api/postApi';
import LoadingPage from '../../components/common/LoadingPage';

const DraftsPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['drafts', page, limit],
    queryFn: () => postApi.getUserDrafts(page, limit),
    // keepPreviousData: true,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">
          Failed to load drafts. Please try again later.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-heading">My Drafts</h1>
        <Link to="/posts/create" className="btn btn-primary">
          Create New Post
        </Link>
      </div>

      {data?.data.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="flex justify-center mb-4">
            <FileText className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">No Drafts Found</h2>
          <p className="text-muted-foreground mb-6">
            You don't have any draft posts yet. Start writing your first post!
          </p>
          <Link to="/posts/create" className="btn btn-primary">
            Create New Post
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {data?.data.map((post: any) => (
              <div
                key={post._id}
                className="card overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="md:flex">
                  {post.coverImage && (
                    <div className="md:w-1/4">
                      <img
                        src={post.coverImage || '/placeholder.svg'}
                        alt={post.title}
                        className="h-40 md:h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div
                    className={`p-6 ${post.coverImage ? 'md:w-3/4' : 'w-full'}`}
                  >
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar size={14} className="mr-1" />
                      <span>Last updated: {formatDate(post.updatedAt)}</span>
                    </div>

                    <Link to={`/posts/edit/${post._id}`}>
                      <h2 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="badge badge-outline">Draft</span>
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          to={`/posts/${post._id}`}
                          className="btn btn-sm btn-outline flex items-center"
                        >
                          <Eye size={16} className="mr-1" />
                          Preview
                        </Link>
                        <Link
                          to={`/posts/edit/${post._id}`}
                          className="btn btn-sm btn-primary flex items-center"
                        >
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
        </>
      )}
    </div>
  );
};

export default DraftsPage;
