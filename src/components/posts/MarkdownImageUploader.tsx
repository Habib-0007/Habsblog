import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { createDirectImageMarkdown } from '../../utils/imageUpload';
import toast from 'react-hot-toast';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  "image/ico",
  'image/gif',
  'image/webp',
  'image/svg+xml',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const MarkdownImageUploader = ({
  onImageInsert,
}: {
  onImageInsert: (markdownText: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const validateImage = (file: File): boolean => {
    // Check file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error(
        'Please select a valid image file (JPEG, PNG, GIF, WEBP, SVG)',
      );
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image file is too large. Maximum size is 5MB');
      return false;
    }

    return true;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!validateImage(file)) {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setIsUploading(true);

      try {
        // Use direct base64 embedding for simpler preview
        const markdownText = await createDirectImageMarkdown(file);

        onImageInsert(markdownText);
        toast.success('Image added successfully');
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error('Failed to add image. Please try again.');
      } finally {
        setIsUploading(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  return (
    <div className="inline-block">
      <button
        type="button"
        onClick={handleImageClick}
        disabled={isUploading}
        className="p-2 rounded hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        title="Insert image"
      >
        {isUploading ? (
          <Upload className="w-5 h-5 animate-spin" />
        ) : (
          <ImageIcon className="w-5 h-5" />
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
};

export default MarkdownImageUploader;
