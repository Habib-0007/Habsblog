import BlogList from "./BlogList"
import useFetch from "./useFetch"
import { useState } from "react"
import db from "../data/db.json"

let Home = () => {
  
  var {data: blogs, isPending, error} = useFetch(db)

  var blogs = blogs.blogs;
  
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
