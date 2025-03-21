import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold font-heading mb-4">HabsBlog</h3>
            <p className="text-muted-foreground text-sm">
              A modern blogging platform for sharing your thoughts and ideas
              with the world.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold font-heading mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/posts/create" className="text-sm hover:text-primary">
                  Write a Post
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm hover:text-primary">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm hover:text-primary">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold font-heading mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} HabsBlog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
