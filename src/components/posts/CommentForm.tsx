'use client';

import type React from 'react';

import { useState } from 'react';
import { Send, Image } from 'lucide-react';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import { useCreateComment } from '../../hooks/useComments';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
}

const CommentForm = ({ postId, parentId, onSuccess }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { mutate: createComment, isPending } = useCreateComment();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // Limit to 3 images
      const newImages = [...images, ...selectedFiles].slice(0, 3);
      setImages(newImages);

      // Create preview URLs
      const newPreviewUrls = newImages.map((file) => URL.createObjectURL(file));
      setPreviewUrls(newPreviewUrls);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    const formData = new FormData();
    formData.append('content', content);
    formData.append('postId', postId);

    if (parentId) {
      formData.append('parentId', parentId);
    }

    images.forEach((image) => {
      formData.append('images', image);
    });

    createComment(formData, {
      onSuccess: () => {
        setContent('');
        setImages([]);
        setPreviewUrls([]);
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="neobrutalism-card mb-6">
      <Textarea
        placeholder={parentId ? 'Write a reply...' : 'Write a comment...'}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mb-4"
      />

      {previewUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url || '/placeholder.svg'}
                alt={`Preview ${index}`}
                className="w-20 h-20 object-cover border-2 border-black"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                onClick={() => removeImage(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              disabled={images.length >= 3}
            />
            <Button
              type="button"
              variant="outline"
              leftIcon={<Image className="w-4 h-4" />}
              disabled={images.length >= 3}
            >
              Add Image {images.length > 0 && `(${images.length}/3)`}
            </Button>
          </label>
        </div>

        <Button
          type="submit"
          disabled={!content.trim() || isPending}
          isLoading={isPending}
          rightIcon={<Send className="w-4 h-4" />}
        >
          {parentId ? 'Reply' : 'Comment'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
