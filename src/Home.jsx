import BlogList from "./BlogList";
import useFetch from "./useFetch";
import { useState } from "react";

let Home = () => {
	var {
		data: blogs,
		isPending,
		error,
	} = useFetch(
		"https://habsblog-api.vercel.app/api/blogs"
	);

	return (
		<div>
			{isPending && (
				<div> Loading... </div>
			)}
			{blogs && (
				<BlogList
					blogs={blogs}
					title="All Blogs"
				/>
			)}
			{error && <div> {error} </div>}
		</div>
	);
};

export default Home;
