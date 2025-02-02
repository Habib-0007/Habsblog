import React from 'react';
import { useState, useEffect } from 'react';
import { getAllPosts } from '../api/post';
import PostCard from '../components/PostCard';
import { Post } from "../types/post"

const BlogTimeline: React.FC = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const allPosts = await getAllPosts();
				setPosts(allPosts);
				setLoading(false);
			} catch (error) {
				console.error('Failed to fetch posts:', error);
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="blog-timeline">
			<h2>All Posts</h2>
			{posts.length === 0 ? (
				<p>No posts available.</p>
			) : (
				posts.map((post) => <PostCard key={post._id} post={post} />)
			)}
		</div>
	);
};

export default BlogTimeline;
