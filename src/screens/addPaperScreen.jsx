import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AddPaper() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#E7ECEF] via-[#A3CEF1] to-[#6096BA] text-[#274C77] p-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-md px-6 py-4 mb-8 flex justify-between items-center"
      >
        <button
          onClick={() => navigate(-1)}
          className="text-2xl hover:text-[#6096BA] transition"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">Add Your Paper</h1>
        <div className="w-6"></div>
      </motion.header>

      {/* Form Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8"
      >
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Title:</label>
            <input
              type="text"
              placeholder="Enter paper title"
              className="w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Abstract:</label>
            <textarea
              rows="4"
              placeholder="Enter abstract"
              className="w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50 resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Year:</label>
              <input
                type="number"
                placeholder="2025"
                className="w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL:</label>
              <input
                type="url"
                placeholder="Enter paper URL"
                className="w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">PDF Key:</label>
              <input
                type="text"
                placeholder="Unique paper key"
                className="w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author:</label>
              <input
                type="text"
                placeholder="Enter author name"
                className="w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags:</label>
            <input
              type="text"
              placeholder="e.g., AI, NLP, Data Science"
              className="w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">References:</label>
            <input
              type="text"
              placeholder="Add reference links or IDs"
              className="w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50"
            />
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-[#274C77] hover:bg-[#6096BA] text-white rounded-full font-semibold shadow-md transition-all"
            >
              💾 Save Paper
            </button>
          </div>
        </form>
      </motion.section>
    </div>
  );
}
