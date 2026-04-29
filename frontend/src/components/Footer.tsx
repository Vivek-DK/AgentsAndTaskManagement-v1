import "./footer.css";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const links = {
  github: "https://github.com/Vivek-DK",
  linkedin: "https://linkedin.com/in/vivekdk1310",
  email: "mailto:vivek.dkrishnamurthy@gmail.com",
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT */}
        <div className="footer-left">
          <h3>AgentTask Manager</h3>
          <p>
            Manage agents, distribute tasks automatically, and monitor workflow
            efficiently with a scalable full-stack dashboard.
          </p>
        </div>

        {/* CENTER */}
        <div className="footer-center">
          <h4>Tech Stack</h4>
          <ul>
            <li>MongoDB & Mongoose</li>
            <li>Express.js & Node.js</li>
            <li>React + TypeScript</li>
            <li>Vite & Axios</li>
            <li>JWT Auth & Context API</li>
          </ul>
        </div>

        {/* RIGHT */}
        <div className="footer-right">
          <h4>Contact</h4>

          <div className="footer-icons">
            <a href={links.github} target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>

            <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>

            <a href={links.email}>
              <FaEnvelope />
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Agent & Task Manager — Built with MERN + TS
      </div>
    </footer>
  );
}