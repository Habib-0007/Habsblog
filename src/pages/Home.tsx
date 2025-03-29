import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import PostList from '../components/posts/PostList';
import { usePosts } from '../hooks/usePosts';
import type { PostFilters } from '../types/post';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<PostFilters>({
    status: 'published',
    page: 1,
    limit: 9,
  });

  useEffect(() => {
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');
    const author = searchParams.get('author');
    const sortBy = searchParams.get('sortBy') as
      | 'newest'
      | 'oldest'
      | 'popular'
      | undefined;
    const page = searchParams.get('page');

    setFilters((prev) => ({
      ...prev,
      search: search || undefined,
      tag: tag || undefined,
      author: author || undefined,
      sortBy: sortBy || 'newest',
      page: page ? Number.parseInt(page) : 1,
    }));
  }, [searchParams]);

  const { data, isLoading, isError } = usePosts(filters);

  const handleSearch = (query: string) => {
    setSearchParams((prev) => {
      if (query) {
        prev.set('search', query);
      } else {
        prev.delete('search');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handleFilter = (tag: string) => {
    setSearchParams((prev) => {
      prev.set('tag', tag);
      prev.set('page', '1');
      return prev;
    });
  };

  if (isError) {
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
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 gradient-text-vibrant">
          Welcome to HabsBlog
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover interesting articles, share your thoughts, and connect with
          other writers.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : (
        <PostList
          posts={data?.data || []}
          isLoading={isLoading}
          onSearch={handleSearch}
          onFilter={handleFilter}
        />
      )}

      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <button
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set('page', String(Math.max(1, filters.page! - 1)));
                  return prev;
                })
              }
              disabled={filters.page === 1}
              className="neobrutalism-button px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="flex items-center px-4 font-bold">
              Page {filters.page} of {data.pagination.totalPages}
            </span>

            <button
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set(
                    'page',
                    String(
                      Math.min(data.pagination.totalPages, filters.page! + 1),
                    ),
                  );
                  return prev;
                })
              }
              disabled={filters.page === data.pagination.totalPages}
              className="neobrutalism-button px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
