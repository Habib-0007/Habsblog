import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, FileText, MessageSquare, Eye, ThumbsUp } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import LoadingPage from '../../components/common/LoadingPage';

const AdminDashboardPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminApi.getDashboardStats,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">
          Failed to load dashboard data. Please try again later.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const stats = data?.data.stats;
  const recentUsers = data?.data.recentUsers;
  const recentPosts = data?.data.recentPosts;
  const popularPosts = data?.data.popularPosts;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-heading mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Total Users</h2>
            <Users className="h-6 w-6 text-primary" />
          </div>
          <p className="text-4xl font-bold">{stats?.totalUsers || 0}</p>
          <Link
            to="/admin/users"
            className="text-sm text-primary hover:underline mt-2 inline-block"
          >
            View all users
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Total Posts</h2>
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <p className="text-4xl font-bold">{stats?.totalPosts || 0}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
            <span>{stats?.publishedPosts || 0} published</span>
            <span>{stats?.draftPosts || 0} drafts</span>
          </div>
          <Link
            to="/admin/posts"
            className="text-sm text-primary hover:underline mt-2 inline-block"
          >
            View all posts
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Total Comments</h2>
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <p className="text-4xl font-bold">{stats?.totalComments || 0}</p>
          <Link
            to="/admin/comments"
            className="text-sm text-primary hover:underline mt-2 inline-block"
          >
            View all comments
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Users</h2>
          </div>
          <div className="card-content">
            {recentUsers && recentUsers.length > 0 ? (
              <div className="divide-y divide-border">
                {recentUsers.map((user: any) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden mr-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar || '/placeholder.svg'}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>{user.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No users found.</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Posts</h2>
          </div>
          <div className="card-content">
            {recentPosts && recentPosts.length > 0 ? (
              <div className="divide-y divide-border">
                {recentPosts.map((post: any) => (
                  <div key={post._id} className="py-3">
                    <div className="flex justify-between mb-1">
                      <Link
                        to={`/posts/${post._id}`}
                        className="font-medium hover:text-primary"
                      >
                        {post.title}
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="flex items-center mr-3">
                        <Eye size={14} className="mr-1" />
                        {post.viewCount}
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp size={14} className="mr-1" />
                        {post.likeCount}
                      </span>
                      <span className="ml-auto badge badge-outline">
                        {post.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No posts found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Popular Posts</h2>
        </div>
        <div className="card-content">
          {popularPosts && popularPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Author</th>
                    <th className="text-center py-3 px-4">
                      <div className="flex items-center justify-center">
                        <Eye size={14} className="mr-1" />
                        Views
                      </div>
                    </th>
                    <th className="text-center py-3 px-4">
                      <div className="flex items-center justify-center">
                        <ThumbsUp size={14} className="mr-1" />
                        Likes
                      </div>
                    </th>
                    <th className="text-right py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {popularPosts.map((post: any) => (
                    <tr
                      key={post._id}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-3 px-4">
                        <Link
                          to={`/posts/${post._id}`}
                          className="font-medium hover:text-primary"
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{post.author.name}</td>
                      <td className="text-center py-3 px-4">
                        {post.viewCount}
                      </td>
                      <td className="text-center py-3 px-4">
                        {post.likeCount}
                      </td>
                      <td className="text-right py-3 px-4 text-muted-foreground">
                        {formatDate(post.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No popular posts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
