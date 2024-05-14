import {
	useParams,
	useHistory,
} from "react-router-dom";
import useFetch from "./useFetch";

const BlogDetails = () => {
	const { id } = useParams();

	const {
		data: blog,
		error,
		isPending,
	} = useFetch(
		"https://habsblog-api.vercel.app/api/blogs/" +
			id
	);

	const history = useHistory();

	let handleDelete = () => {
		fetch(
			"http://localhost:5001/api/blogs/" +
				blog.id,
			{ method: "DELETE" }
		).then(() => {
			alert(
				"Blog successfully deleted"
			);
			history.push("/");
		}).catch(err => alert(err.message))
	};

	return (
		<div className="blog-view">
			{isPending && (
				<div> Loading... </div>
			)}
			{error && <div> {error} </div>}
			{blog && (
				<article>
					<h2> {blog.title} </h2>
					<p>
						Wriiten By: {blog.author}
					</p>
					<div>{blog.body}</div>
					<button
						onClick={handleDelete}
					>
						Delete
					</button>
				</article>
			)}
		</div>
	);
};

export default BlogDetails;
