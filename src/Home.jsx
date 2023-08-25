import BlogList from "./BlogList"
import useFetch from "./useFetch"
import { useState } from "react"

let Home = () => {
  
  const {data: blogs, isPending, error} = useFetch("https://api.npoint.io/d9634f01c1e54bc298d2/blogs");
  
 {/* const [postsPerPage, setPostsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  blogs = blogs.slice(1, 5); */ }
  
  return (
    <div>
      {isPending && <div> Loading... </div> }
      {blogs && <BlogList blogs={blogs} title="All Blogs" />}
      {error && <div> {error} </div>}
      { blogs && console.log(blogs) }
    </div>
  );
}

export default Home;
