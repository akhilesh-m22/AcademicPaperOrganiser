import React from "react";
import { motion } from "framer-motion";

export default function UserDashboard() {
  const papers = [
    { title: "Deep Learning for NLP", author: "Smith et al.", tags: "AI, NLP", year: 2023 },
    { title: "Blockchain in Education", author: "Doe et al.", tags: "Blockchain, EdTech", year: 2022 },
    { title: "Climate Change Analytics", author: "Rao et al.", tags: "Environment, Data", year: 2024 },
    { title: "Quantum Computing Trends", author: "Patel et al.", tags: "Quantum, ML", year: 2023 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#E7ECEF] via-[#A3CEF1] to-[#6096BA] text-[#274C77] p-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-md px-6 py-4 mb-8"
      >
        <div className="font-bold text-2xl">📚 Academic Paper Organizer</div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search papers..."
            className="px-4 py-2 rounded-xl bg-white/30 border-none outline-none focus:ring-2 focus:ring-[#274C77] placeholder-[#274C77]/70"
          />
          <button className="px-4 py-2 bg-[#274C77] hover:bg-[#6096BA] text-white rounded-xl font-semibold transition-all">
            Search
          </button>
        </div>
      </motion.header>

      {/* Main Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 flex-1 overflow-x-auto"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Recent Papers</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#E7ECEF]/40">
                <th className="p-3 text-left font-semibold">Title</th>
                <th className="p-3 text-left font-semibold">Author</th>
                <th className="p-3 text-left font-semibold">Tags</th>
                <th className="p-3 text-left font-semibold">Year</th>
                <th className="p-3 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {papers.map((paper, idx) => (
                <tr
                  key={idx}
                  className="border-t border-white/40 hover:bg-white/10 transition"
                >
                  <td className="p-3">{paper.title}</td>
                  <td className="p-3">{paper.author}</td>
                  <td className="p-3">{paper.tags}</td>
                  <td className="p-3">{paper.year}</td>
                  <td className="p-3 text-center">
                    <button className="px-4 py-2 rounded-xl bg-[#A3CEF1] hover:bg-[#6096BA] text-[#274C77] font-semibold transition-all">
                      View Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center">
          <button className="px-6 py-3 bg-[#274C77] hover:bg-[#6096BA] text-white rounded-full font-semibold shadow-md transition-all">
            ➕ Add Paper
          </button>
        </div>
      </motion.section>
    </div>
  );
}