import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const links = {
  github: "https://github.com/Vivek-DK",
  linkedin: "https://linkedin.com/in/vivekdk1310",
  email: "mailto:vivek.dkrishnamurthy@gmail.com",
};

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-white/5 backdrop-blur-xl">

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

        {/* LEFT */}
        <div>
          <h3 className="text-xl font-semibold mb-3 
            bg-gradient-to-r from-indigo-400 to-purple-500 
            bg-clip-text text-transparent">
            AgentTask Manager
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Manage agents, distribute tasks automatically, and monitor workflow
            efficiently with a scalable full-stack dashboard.
          </p>
        </div>

        {/* CENTER */}
        <div>
          <h4 className="text-white font-medium mb-4">Tech Stack</h4>

          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-white transition">MongoDB & Mongoose</li>
            <li className="hover:text-white transition">Express.js & Node.js</li>
            <li className="hover:text-white transition">React + TypeScript</li>
            <li className="hover:text-white transition">Vite & Axios</li>
            <li className="hover:text-white transition">JWT Auth & Context API</li>
          </ul>
        </div>

        {/* RIGHT */}
        <div>
          <h4 className="text-white font-medium mb-4">Contact</h4>

          <div className="flex gap-4 text-lg">

            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white/5 border border-white/10 
              hover:bg-white/10 hover:scale-110 transition"
            >
              <FaGithub />
            </a>

            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white/5 border border-white/10 
              hover:bg-blue-500/20 hover:text-blue-400 hover:scale-110 transition"
            >
              <FaLinkedin />
            </a>

            <a
              href={links.email}
              className="p-3 rounded-lg bg-white/5 border border-white/10 
              hover:bg-indigo-500/20 hover:text-indigo-400 hover:scale-110 transition"
            >
              <FaEnvelope />
            </a>

          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Agent & Task Manager — Built with MERN + TS
      </div>
    </footer>
  );
}