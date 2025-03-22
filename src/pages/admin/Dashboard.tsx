import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Eye,
  ThumbsUp,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import { useDashboardStats } from '../../hooks/useAdmin';
import { formatDate } from '../../lib/utils';

const Dashboard = () => {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't load the dashboard data. Please try again later.
        </p>
      </div>
    );
  }

  const { stats, recentUsers, recentPosts, popularPosts } = data;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 gradient-text">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Total Users</p>
              <h2 className="text-3xl font-bold">{stats.totalUsers}</h2>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Total Posts</p>
              <h2 className="text-3xl font-bold">{stats.totalPosts}</h2>
              <div className="flex text-sm text-muted-foreground mt-1">
                <span className="mr-3">{stats.publishedPosts} published</span>
                <span>{stats.draftPosts} drafts</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Total Comments</p>
              <h2 className="text-3xl font-bold">{stats.totalComments}</h2>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Engagement</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 mr-1 text-muted-foreground" />
                  <span className="font-bold">
                    {popularPosts.reduce(
                      (sum: any, post: any) => sum + post.viewCount,
                      0,
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="w-5 h-5 mr-1 text-muted-foreground" />
                  <span className="font-bold">
                    {popularPosts.reduce(
                      (sum: any, post: any) => sum + post.likeCount,
                      0,
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Users</h2>
          <div className="space-y-4">
            {recentUsers.map((user: any) => (
              <div
                key={user._id}
                className="flex items-center justify-between border-b border-border pb-2"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-black mr-3">
                    <img
                      src={user.avatar || '/placeholder.svg'}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold">{user.name}</p>
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
          <div className="mt-4">
            <Link to="/admin/users" className="text-primary hover:underline">
              View all users
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {recentPosts.map((post: any) => (
              <div key={post._id} className="border-b border-border pb-2">
                <Link
                  to={`/posts/${post._id}`}
                  className="font-bold hover:text-primary"
                >
                  {post.title}
                </Link>
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>By {post.author.name}</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/admin/posts" className="text-primary hover:underline">
              View all posts
            </Link>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Popular Posts</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2">Author</th>
                <th className="text-center py-2">Views</th>
                <th className="text-center py-2">Likes</th>
                <th className="text-right py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {popularPosts.map((post: any) => (
                <tr key={post._id} className="border-b border-border">
                  <td className="py-2">
                    <Link
                      to={`/posts/${post._id}`}
                      className="hover:text-primary"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="py-2">{post.author.name}</td>
                  <td className="text-center py-2">{post.viewCount}</td>
                  <td className="text-center py-2">{post.likeCount}</td>
                  <td className="text-right py-2">
                    {formatDate(post.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
