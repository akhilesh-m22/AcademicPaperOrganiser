import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fetchUserPapers } from "@/lib/api";

export default function MyPapers() {
  const navigate = useNavigate();

  const [userPapers, setUserPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('api_token');
    if (!token) {
      navigate('/');
      return;
    }
    
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) {
      setUserPapers([]);
      setLoading(false);
      return;
    }
    fetchUserPapers(user.id).then(data => {
      setUserPapers(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => { setUserPapers([]); setLoading(false); });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('api_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#E7ECEF] via-[#A3CEF1] to-[#6096BA] text-[#274C77] p-6 overflow-hidden relative">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-md px-6 py-4 mb-8"
      >
        <button 
          onClick={() => navigate('/dashboard')}
          className="font-bold text-2xl hover:text-[#6096BA] transition cursor-pointer"
        >
          📚 Academic Paper Organizer
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="ml-3 text-2xl font-bold text-[#274C77] hover:text-[#6096BA] transition"
          >
            ☰
          </button>
        </div>
      </motion.header>

      {/* Sidebar Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-[#274C77] to-[#6096BA] text-white shadow-2xl z-50 p-8 overflow-y-auto"
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 right-4 text-3xl hover:text-[#E7ECEF] transition"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-8 mt-8">Menu</h2>
              <nav className="space-y-4">
                <button
                  onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  🏠 Home
                </button>
                <button
                  onClick={() => { setMenuOpen(false); navigate('/user-papers'); }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  📄 My Papers
                </button>
                <button
                  onClick={() => { setMenuOpen(false); navigate('/add-paper'); }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  ➕ Add Paper
                </button>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-red-500/80 hover:bg-red-600 transition"
                >
                  🚪 Logout
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 flex-1 overflow-x-auto"
      >
        <h2 className="text-2xl font-bold text-center mb-6">My Papers</h2>

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
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#274C77]/70">
                    Loading your papers...
                  </td>
                </tr>
              ) : userPapers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#274C77]/70">
                    No papers found. Start by adding your first paper!
                  </td>
                </tr>
              ) : (
                userPapers.map((paper, idx) => (
                  <tr
                    key={paper.id || idx}
                    className="border-t border-white/40 hover:bg-white/10 transition"
                  >
                    <td className="p-3">{paper.title}</td>
                    <td className="p-3">{paper.Authors || 'N/A'}</td>
                    <td className="p-3">{paper.Tags || 'N/A'}</td>
                    <td className="p-3">{paper.year || 'N/A'}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => navigate(`/papers/${paper.id}`)}
                        className="px-4 py-2 rounded-xl bg-[#A3CEF1] hover:bg-[#6096BA] text-[#274C77] font-semibold transition-all"
                      >
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/add-paper")}
            className="px-6 py-3 bg-[#274C77] hover:bg-[#6096BA] text-white rounded-full font-semibold shadow-md transition-all"
          >
            ➕ Add Paper
          </button>
        </div>
      </motion.section>
    </div>
  );
}
