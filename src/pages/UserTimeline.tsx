import React from 'react';
import { useState, useEffect } from 'react';
import { Post } from '../types/post';
import { useAuth } from '../hooks/useAuth';
import { getUserPosts } from '../api/post';
import PostCard from '../components/PostCard';

const UserTimeline: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userPosts = await getUserPosts(user!.id);
        setPosts(userPosts);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user posts:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-timeline">
      <h2>My Posts</h2>
      {posts.length === 0 ? (
        <p>You haven't created any posts yet.</p>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
};

export default UserTimeline;
