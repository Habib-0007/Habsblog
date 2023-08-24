import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faXTwitter, faGithub, faWhatsapp } from '@fortawesome/free-brands-svg-icons'

let Footer = () => {
  return(
    <div className="footer">
       <ul className="icons">
        hello
       { /* <li> <a href="https://facebook.com" target="_blank">
         <FontAwesomeIcon icon={faFacebook} />
        </a></li>
        
        <li> <a href="https://twitter.com" target="_blank">
          <FontAwesomeIcon icon={faXTwitter} />
       </a></li>
       
       <li> <a href="https://github.com" target="_blank">
         <FontAwesomeIcon icon={faGithub} />
        </a></li>
        
        <li> <a href="https://whatsapp.com" target="_blank">
          <FontAwesomeIcon icon={faWhatsapp} />
         </a></li> */ }
       </ul>
    </div>
  );
}

export default Footer;