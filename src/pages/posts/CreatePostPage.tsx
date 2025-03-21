'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Image, X, TagIcon, Save } from 'lucide-react';
import { postApi } from '../../api/postApi';
import type { CreatePostData } from '../../types/post';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CreatePostPage = () => {
  const navigate = useNavigate();

  const [postData, setPostData] = useState<CreatePostData>({
    title: '',
    content: '',
    excerpt: '',
    tags: [],
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null,
  );
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPostMutation = useMutation({
    mutationFn: (data: CreatePostData) => postApi.createPost(data),
    onSuccess: (data) => {
      toast.success('Post created successfully!');
      navigate(`/posts/${data.data._id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create post');
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !postData.tags?.includes(trimmedTag)) {
      setPostData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), trimmedTag],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPostData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!postData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!postData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    const formData: CreatePostData = {
      ...postData,
      status,
    };

    if (coverImageFile) {
      formData.coverImage = coverImageFile;
    }

    createPostMutation.mutate(formData);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title text-3xl">Create New Post</h1>
        </div>

        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={postData.title}
                onChange={handleChange}
                className="input text-xl font-bold"
                placeholder="Enter post title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Cover Image
              </label>
              {coverImagePreview ? (
                <div className="relative mb-4">
                  <img
                    src={coverImagePreview || '/placeholder.svg'}
                    alt="Cover preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImageFile(null);
                      setCoverImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-border rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors"
                >
                  <Image className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Click to upload cover image
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium mb-1"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={postData.content}
                onChange={handleChange}
                className="input min-h-[300px]"
                placeholder="Write your post content here..."
                required
              />
            </div>

            <div>
              <label
                htmlFor="excerpt"
                className="block text-sm font-medium mb-1"
              >
                Excerpt (optional)
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={postData.excerpt}
                onChange={handleChange}
                className="input min-h-[100px]"
                placeholder="Write a short excerpt for your post..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                If left empty, an excerpt will be generated from your content.
              </p>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {postData.tags?.map((tag) => (
                  <div
                    key={tag}
                    className="bg-muted rounded-full px-3 py-1 text-sm flex items-center"
                  >
                    <TagIcon size={14} className="mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  id="tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="input flex-grow"
                  placeholder="Add tags (press Enter or comma to add)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn btn-outline ml-2"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="draft"
                    name="status"
                    checked={status === 'draft'}
                    onChange={() => setStatus('draft')}
                    className="h-4 w-4"
                  />
                  <label htmlFor="draft" className="text-sm">
                    Save as Draft
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="published"
                    name="status"
                    checked={status === 'published'}
                    onChange={() => setStatus('published')}
                    className="h-4 w-4"
                  />
                  <label htmlFor="published" className="text-sm">
                    Publish Now
                  </label>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createPostMutation.isPending}
                >
                  {createPostMutation.isPending ? (
                    <span className="flex items-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {status === 'draft' ? 'Save Draft' : 'Publish Post'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
