import React from 'react'

export default function PageNotFound () {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-72 h-72 bg-indigo-500/20 blur-[120px] rounded-full top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-purple-500/20 blur-[120px] rounded-full bottom-10 right-10"></div>

      {/* CONTENT */}
      <div className="relative z-10 animate-[fadeUp_0.6s_ease]">

        {/* ERROR CODE */}
        <h1 className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4">
          404
        </h1>

        {/* TITLE */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">
          Page Not Found
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          The page you’re looking for doesn’t exist or may have been moved.
          Let’s get you back on track.
        </p>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <a
            href="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 
            hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:scale-105"
          >
            Go Home
          </a>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl border border-white/20 text-gray-300 
            hover:bg-white/10 transition-all duration-300 font-semibold hover:scale-105"
          >
            Go Back
          </button>

        </div>

      </div>
    </div>
  )
}

