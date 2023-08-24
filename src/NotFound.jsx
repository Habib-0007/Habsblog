import { Link } from "react-router-dom"

let NotFound = () => {
  return (
    <div className="notfound">
      <h2> Oops... </h2>
      <p> Site cannot be found </p>
      <Link to="/"> Go to homepage </Link>
    </div>
  );
}

export default NotFound;