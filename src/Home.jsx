import BlogList from "./BlogList"
import useFetch from "./useFetch"
import { useState } from "react"

let Home = () => {
  
  const {data: blogs, isPending, error} = useFetch("../data/db.json/blogs")
  
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
