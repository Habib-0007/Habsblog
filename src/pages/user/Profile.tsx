'use client';

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Calendar, FileText } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { useAuthStore } from '../../store/authStore';
import { usePosts } from '../../hooks/usePosts';
import PostCard from '../../components/posts/PostCard';
import { formatDate } from '../../lib/utils';

const Profile = () => {
  const { user, getProfile } = useAuthStore();

  useEffect(() => {
    getProfile().catch(console.error);
  }, [getProfile]);

  const { data: postsData, isLoading: isLoadingPosts } = usePosts({
    author: user?._id,
    status: 'published',
    limit: 3,
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar
            src={user.avatar}
            alt={user.name}
            size="lg"
            className="w-24 h-24 md:w-32 md:h-32"
          />

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <h1 className="text-3xl font-bold mb-2 md:mb-0 gradient-text-cool">
                {user.name}
              </h1>

              <Link to="/profile/edit">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit className="w-4 h-4" />}
                >
                  Edit Profile
                </Button>
              </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4 text-muted-foreground">
              <div className="flex items-center justify-center md:justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                {/* <span>Joined {formatDate(user.createdAt)}</span> */}
              </div>

              <div className="flex items-center justify-center md:justify-start">
                <FileText className="w-4 h-4 mr-2" />
                <span>{postsData?.count || 0} Posts</span>
              </div>
            </div>

            {user.bio ? (
              <p className="text-muted-foreground">{user.bio}</p>
            ) : (
              <p className="text-muted-foreground italic">No bio provided</p>
            )}
          </div>
        </div>
      </Card>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Posts</h2>
          <Link to="/posts/create">
            <Button size="sm">Write New Post</Button>
          </Link>
        </div>

        {isLoadingPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="neobrutalism-card animate-pulse">
                <div className="h-48 bg-muted mb-4"></div>
                <div className="h-6 bg-muted w-3/4 mb-2"></div>
                <div className="h-4 bg-muted w-full mb-2"></div>
                <div className="h-4 bg-muted w-2/3"></div>
              </div>
            ))}
          </div>
        ) : postsData?.data.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-bold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't published any posts yet. Start writing today!
            </p>
            <Link to="/posts/create">
              <Button>Write Your First Post</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {postsData?.data.map((post: any) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {postsData && postsData.count > 3 && (
          <div className="text-center mt-6">
            <Link to={`/?author=${user._id}`}>
              <Button variant="outline">View All Posts</Button>
            </Link>
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Drafts</h2>
          <Link to="/posts/drafts">
            <Button variant="outline" size="sm">
              View All Drafts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
