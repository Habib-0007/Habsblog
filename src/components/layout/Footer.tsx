import { Link } from "react-router-dom"
import { Github, Twitter, Linkedin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-background border-t-2 border-black mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 gradient-text-cool">HabsBlog</h3>
            <p className="text-muted-foreground">A modern blog platform built with React, TypeScript, and Express.</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/posts/create" className="hover:text-primary">
                  Write a Post
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-black text-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} HabsBlog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

