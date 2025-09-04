// src/app/page.jsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-indigo-300/30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10rem] right-[-10rem] w-[30rem] h-[30rem] rounded-full bg-pink-300/30 blur-3xl animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 glass p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent mb-6">
          School Management
        </h1>
        <p className="text-slate-600 mb-10">
          A simple app to manage school records. Add, view, edit, and delete schools with ease by Anamitra Roy.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/addschool"
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:bg-indigo-700 transition"
          >
            ➕ Add School
          </Link>

          <Link
            href="/showSchools"
            className="px-6 py-3 rounded-xl bg-pink-500 text-white font-semibold shadow-md hover:shadow-lg hover:bg-pink-600 transition"
          >
            📖 Show Schools
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

