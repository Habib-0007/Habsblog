import type React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types/post';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>By: {post.author.username}</p>
      <p>{post.content.substring(0, 100)}...</p>
      {post.images.length > 0 && (
        <img
          src={post.images[0] || '/placeholder.svg'}
          alt="Post thumbnail"
          className="post-thumbnail"
        />
      )}
      <Link to={`/post/${post.id}`}>Read more</Link>
    </div>
  );
};

export default PostCard;
