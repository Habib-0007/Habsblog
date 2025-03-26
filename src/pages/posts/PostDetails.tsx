import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, ThumbsUp, Eye, Edit, Trash2, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import CommentForm from '../../components/posts/CommentForm';
import CommentList from '../../components/posts/CommentList';
import { usePost, useLikePost, useDeletePost } from '../../hooks/usePosts';
import { useComments } from '../../hooks/useComments';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../../lib/utils';

const PostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const { data: post, isLoading, isError } = usePost(id!);
  const { mutate: likePost } = useLikePost();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const [commentsKey, setCommentsKey] = useState(0);
  const { data: commentsData } = useComments({
    postId: id!,
    page: 1,
    limit: 50,
  });

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Please login to like this post');
      return;
    }

    likePost(id!);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(id!, {
        onSuccess: () => {
          navigate('/');
        },
      });
    }
  };

  const refreshComments = () => {
    setCommentsKey((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <p className="text-muted-foreground mb-6">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/">
          <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const isAuthor = user?._id === post.author?._id;
  const isAdmin = user?.role === 'admin';
  const canEdit = isAuthor || isAdmin;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </Link>
      </div>

      <Card className="mb-8">
        {post.coverImage && (
          <div className="h-64 md:h-96 w-full overflow-hidden border-b-2 border-black mb-6">
            <img
              src={post.coverImage || '/placeholder.svg'}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag: any, index: number) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <div className="flex items-center">
              <Avatar
                src={post.author?.avatar}
                alt={post.author?.name}
                size="sm"
                className="mr-3"
              />
              <div>
                <div className="font-bold">{post.author?.name}</div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(post.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center text-muted-foreground">
                <Eye className="w-5 h-5 mr-1" />
                <span>{post.viewCount}</span>
              </div>

              <button
                onClick={handleLike}
                className={`flex items-center gap-1 ${
                  post.likedBy?.includes(user?._id || '')
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                <span>{post.likeCount}</span>
              </button>

              {canEdit && (
                <div className="flex gap-2">
                  <Link to={`/posts/edit/${post._id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Edit className="w-4 h-4" />}
                    >
                      Edit
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            {post.htmlContent ? (
              <div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
            ) : (
              <ReactMarkdown>{post.content}</ReactMarkdown>
            )}
          </div>
        </div>
      </Card>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>

        {isAuthenticated ? (
          <CommentForm postId={post._id} onSuccess={refreshComments} />
        ) : (
          <Card className="p-6 text-center mb-6">
            <p className="mb-4">Please login to leave a comment</p>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </Card>
        )}

        <CommentList
          key={commentsKey}
          comments={commentsData?.data || []}
          postId={post._id}
          onCommentUpdate={refreshComments}
        />
      </div>
    </div>
  );
};

export default PostDetails;
