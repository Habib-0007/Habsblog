import { Link } from 'react-router-dom';
import { Calendar, ThumbsUp, Eye } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { formatDate } from '../../lib/utils';
import type { Post } from '../../types/post';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden" gradient="subtle">
      {post.coverImage && (
        <div className="relative h-48 w-full overflow-hidden border-b-2 border-black">
          <img
            src={post.coverImage || '/placeholder.svg'}
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}

      <div className="flex-1 py-4 md:px-2">
        <div className="flex items-center space-x-2 mb-3">
          {post.tags &&
            post.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
        </div>

        <Link to={`/posts/${post._id}`}>
          <h2 className="text-xl font-bold mb-2 hover:text-primary line-clamp-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Avatar
              src={post.author?.avatar}
              alt={post.author?.name}
              size="sm"
            />
            <span className="font-medium">{post.author?.name}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <div className="flex items-center mr-3">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center mr-3">
              <ThumbsUp className="w-4 h-4 mr-1" />
              <span>{post.likeCount}</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{post.viewCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
