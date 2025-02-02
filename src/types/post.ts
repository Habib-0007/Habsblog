export interface Post {
	_id: string;
	title: string;
	content: string;
	author: { username: string };
	images: string[];
}