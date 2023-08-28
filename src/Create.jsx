import { useState } from "react"
import { useHistory } from "react-router-dom"

let Create = () => {
  const  [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("")
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();
  
  let handleSubmit = e => {
    e.preventDefault();
    
    let blog = { title, body, author }
    
    setIsPending(true);
    
    fetch("../data/db.json/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog)
      })
      .then(() => {
        alert("Blog successfully created 🙂");
        setIsPending(false);
        history.push("/");
      })
  }
  
  return (
    <div className="create-new">
      <h2> Add a New Blog </h2>
      <form onSubmit={handleSubmit}>
        <label> Blog title: </label>
        <input 
          type="text" 
          value={title} 
          onChange={ e => setTitle(e.target.value) } 
          required
        />
        
        <label> Blog body: </label>
        <textarea 
          value={body} 
          onChange={ e => setBody(e.target.value) } 
          required>
        </textarea>
        
        <label> Blog author: </label>
        <input 
          type="text" 
          value={author} 
          onChange={ e => setAuthor(e.target.value) } 
          required
        />
        
        { isPending ? <button disabled> Adding Blog </button> : <button type="submit"> Add Blog </button> }
      </form>
      
    </div>
  );
}

export default Create;
