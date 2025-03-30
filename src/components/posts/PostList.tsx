import Badge from '../ui/Badge';

import type React from 'react';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import PostCard from './PostCard';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { Post } from '../../types/post';

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  onSearch?: (query: string) => void;
  onFilter?: (tag: string) => void;
}

const PostList = ({ posts, isLoading, onSearch, onFilter }: PostListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags || [])));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleTagFilter = (tag: string) => {
    if (onFilter) {
      onFilter(tag);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="neobrutalism-card animate-pulse">
            <div className="h-48 bg-muted mb-4"></div>
            <div className="h-6 bg-muted w-3/4 mb-2"></div>
            <div className="h-4 bg-muted w-full mb-2"></div>
            <div className="h-4 bg-muted w-full mb-2"></div>
            <div className="h-4 bg-muted w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold mb-2">No posts found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              className="w-full"
            />
          </form>

          <Button
            variant="outline"
            className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 text-white ml-2"
            leftIcon={<Filter className="w-4 h-4" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 neobrutalism-card">
            <h4 className="font-bold mb-2">Filter by tag:</h4>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 hover:text-white"
                  onClick={() => handleTagFilter(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostList;
