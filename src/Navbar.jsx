import { Link } from "react-router-dom"

let Navbar = () => {
  return (
    <nav>
      <h1> Habs Blog </h1>
      <ul>
        <li><Link to="/"> Home </Link></li>
        <li><Link to="/create"> Create Blog </Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;