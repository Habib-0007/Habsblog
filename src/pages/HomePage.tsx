'use client';

import type React from 'react';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Tag, Calendar, Eye, ThumbsUp } from 'lucide-react';
import { postApi } from '../api/postApi';
import type { Post, PostFilters } from '../types/post';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Avatar from '../components/common/Avatar';

const HomePage = () => {
  const [filters, setFilters] = useState<PostFilters>({
    status: 'published',
    sortBy: 'newest',
    page: 1,
    limit: 10,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', filters],
    queryFn: () => postApi.getPosts(filters),
    // keepPreviousData: true,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? undefined : tag;
    setSelectedTag(newTag);
    setFilters({ ...filters, tag: newTag, page: 1 });
  };

  const handleSortChange = (sortBy: 'newest' | 'oldest' | 'popular') => {
    setFilters({ ...filters, sortBy, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Extract all unique tags from posts
  const allTags =
    data?.data.reduce((tags: string[], post: Post) => {
      post.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
      return tags;
    }, []) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
          Welcome to HabsBlog
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover stories, ideas, and expertise from writers on any topic.
        </p>
      </div>

      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-heading">
              {filters.search
                ? `Search results for "${filters.search}"`
                : filters.tag
                ? `Posts tagged with "${filters.tag}"`
                : 'Latest Posts'}
            </h2>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">
                Sort by:
              </span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value as any)}
                className="input py-1 px-2 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Popular</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-lg text-red-500">
                Failed to load posts. Please try again later.
              </p>
            </div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <p className="text-lg text-muted-foreground">No posts found.</p>
              {(filters.search || filters.tag) && (
                <button
                  onClick={() => {
                    setFilters({
                      status: 'published',
                      sortBy: 'newest',
                      page: 1,
                      limit: 10,
                    });
                    setSearchTerm('');
                    setSelectedTag(undefined);
                  }}
                  className="btn btn-outline mt-4"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-8">
                {data?.data.map((post: Post) => (
                  <article
                    key={post._id}
                    className="card overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="md:flex">
                      {post.coverImage && (
                        <div className="md:w-1/3">
                          <img
                            src={post.coverImage || '/placeholder.svg'}
                            alt={post.title}
                            className="h-48 md:h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div
                        className={`p-6 ${
                          post.coverImage ? 'md:w-2/3' : 'w-full'
                        }`}
                      >
                        <div className="flex items-center mb-3">
                          <Avatar
                            src={post.author.avatar}
                            alt={post.author.name}
                            fallback={post.author.name.charAt(0)}
                            className="h-8 w-8 mr-2"
                          />
                          <span className="text-sm font-medium">
                            {post.author.name}
                          </span>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(post.createdAt)}
                          </span>
                        </div>

                        <Link to={`/posts/${post._id}`}>
                          <h3 className="text-xl font-bold font-heading mb-2 hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => handleTagClick(tag)}
                              className={`badge ${
                                selectedTag === tag
                                  ? 'badge-primary'
                                  : 'badge-outline'
                              } flex items-center`}
                            >
                              <Tag size={12} className="mr-1" />
                              {tag}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <Link
                            to={`/posts/${post._id}`}
                            className="text-primary font-medium hover:underline"
                          >
                            Read more
                          </Link>

                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Eye size={14} className="mr-1" />
                              {post.viewCount}
                            </span>
                            <span className="flex items-center">
                              <ThumbsUp size={14} className="mr-1" />
                              {post.likeCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handlePageChange(filters.page! - 1)}
                      disabled={filters.page === 1}
                      className="btn btn-sm btn-outline"
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: data.pagination.totalPages },
                      (_, i) => i + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`btn btn-sm ${
                          page === filters.page ? 'btn-primary' : 'btn-outline'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(filters.page! + 1)}
                      disabled={filters.page === data.pagination.totalPages}
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

        <div className="md:w-1/4">
          <div className="card sticky top-20">
            <div className="card-header">
              <h3 className="card-title text-xl">Popular Tags</h3>
            </div>
            <div className="card-content">
              <div className="flex flex-wrap gap-2">
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  allTags.map((tag: any) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`badge ${
                        selectedTag === tag ? 'badge-primary' : 'badge-outline'
                      } flex items-center`}
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </button>
                  ))
                )}

                {allTags.length === 0 && !isLoading && (
                  <p className="text-sm text-muted-foreground">
                    No tags found.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="card mt-6">
            <div className="card-header">
              <h3 className="card-title text-xl">Join Our Community</h3>
            </div>
            <div className="card-content">
              <p className="text-sm text-muted-foreground mb-4">
                Sign up to create your own posts and join the conversation.
              </p>
              <Link to="/register" className="btn btn-primary w-full">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
