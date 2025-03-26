import type React from 'react';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Image, Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import MarkdownEditor from '../../components/posts/MarkdownEditor';
import { usePost, useUpdatePost } from '../../hooks/usePosts';
import LoadingScreen from '../../components/ui/LoadingScreen';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: post, isLoading, isError } = usePost(id!);
  const { mutate: updatePost, isPending } = useUpdatePost();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null,
  );
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
  }>({});

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setExcerpt(post.excerpt);
      setCoverImagePreview(post.coverImage || null);
      setTags(post.tags || []);
      setStatus(post.status);
    }
  }, [post]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const validate = () => {
    const newErrors: {
      title?: string;
      content?: string;
    } = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim()) newErrors.content = 'Content is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (
    e: React.FormEvent,
    saveStatus: 'draft' | 'published',
  ) => {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    if (excerpt) {
      formData.append('excerpt', excerpt);
    }

    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    if (tags.length > 0) {
      formData.append('tags', JSON.stringify(tags));
    }

    formData.append('status', saveStatus);

    updatePost(
      { id: id!, postData: formData },
      {
        onSuccess: (data) => {
          toast.success(
            saveStatus === 'published'
              ? 'Post published successfully!'
              : 'Draft saved successfully!',
          );
          navigate(`/posts/${data._id}`);
        },
      },
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <p className="text-muted-foreground mb-6">
          The post you're trying to edit doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6 gradient-text">Edit Post</h1>

        <form className="space-y-6">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            error={errors.title}
          />

          <div>
            <label className="block mb-2 font-bold">
              Cover Image (Optional)
            </label>
            {coverImagePreview ? (
              <div className="mb-4 relative">
                <img
                  src={coverImagePreview || '/placeholder.svg'}
                  alt="Cover Preview"
                  className="w-full h-48 object-cover border-2 border-black"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  onClick={() => {
                    setCoverImage(null);
                    setCoverImagePreview(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <div className="h-48 border-2 border-dashed border-black flex items-center justify-center">
                  <div className="text-center">
                    <Image className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      Click to upload cover image
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div>
            <label className="block mb-2 font-bold">Excerpt (Optional)</label>
            <Input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of your post"
            />
            <p className="text-sm text-muted-foreground mt-1">
              If left empty, an excerpt will be generated from your content
            </p>
          </div>

          <div>
            <label className="block mb-2 font-bold">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center bg-muted px-3 py-1 rounded-md border-2 border-black"
                >
                  <span className="mr-1">{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                className="ml-2"
                leftIcon={<Tag className="w-4 h-4" />}
              >
                Add
              </Button>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-bold">Content</label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="Write your post content here..."
              error={errors.content}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="bg-gradient-to-r from-gray-500 to-gray-500 text-white hover:from-gray-600 hover:to-gray-600"
              onClick={(e) => handleSubmit(e, 'draft')}
              isLoading={isPending && status === 'draft'}
            >
              Save as Draft
            </Button>

            <Button
              type="button"
              variant="outline"
              className="bg-gradient-to-r from-blue-500 to-blue-500 text-white hover:from-blue-600 hover:to-blue-600"
              onClick={(e) => handleSubmit(e, 'published')}
              isLoading={isPending && status === 'published'}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {post.status === 'published' ? 'Update' : 'Publish'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditPost;
