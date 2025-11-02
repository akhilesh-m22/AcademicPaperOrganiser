import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

export default function PaperDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const [paper, setPaper] = useState({
    title: "AI in Healthcare",
    abstract: "Exploring the role of artificial intelligence in improving medical diagnostics and treatment.",
    year: "2023",
    url: "https://example.com/ai-healthcare",
    pdfKey: "AI2023-001",
    author: "Dr. John Smith",
    tags: "AI, Health, Medicine",
    references: "https://ref1.com, https://ref2.com",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaper({ ...paper, [name]: value });
  };

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
        <h1 className="text-xl font-bold">Paper #{id || 1}</h1>
        <div className="w-6"></div>
      </motion.header>

      {/* Paper Details */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8"
      >
        <form className="space-y-5">
          {Object.entries(paper).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</label>
              {key === "abstract" ? (
                <textarea
                  name={key}
                  value={value}
                  disabled={!isEditing}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50 resize-none ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              ) : (
                <input
                  type="text"
                  name={key}
                  value={value}
                  disabled={!isEditing}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50 ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              )}
            </div>
          ))}

          <div className="mt-8 flex justify-center gap-6">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-3 bg-[#274C77] hover:bg-[#6096BA] text-white rounded-full font-semibold shadow-md transition-all"
            >
              {isEditing ? "Save" : "Edit"}
            </button>

            <button
              type="button"
              onClick={() => alert("Paper deleted (demo mode)")}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold shadow-md transition-all"
            >
              Delete
            </button>
          </div>
        </form>
      </motion.section>
    </div>
  );
}