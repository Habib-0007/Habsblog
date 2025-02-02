import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/post';
import MarkdownEditor from '../components/MarkdownEditor';

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost({ title, content, images });
      navigate('/user-timeline');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <MarkdownEditor value={content} onChange={setContent} />
        </div>
        <div>
          <label htmlFor="images">Images:</label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
