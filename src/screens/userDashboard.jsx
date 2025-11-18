import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { fetchPapers, getRecentPapersCount } from "@/lib/api";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [recentCount, setRecentCount] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('api_token');
    if (!token) {
      navigate('/');
      return;
    }
    loadPapers();
    // fetch recent papers count (last 7 days)
    getRecentPapersCount(7).then(d => {
      if (d && typeof d.count !== 'undefined') setRecentCount(d.count);
    }).catch(() => {});
  }, []);

  const loadPapers = () => {
    let mounted = true;
    setLoading(true);
    fetchPapers().then(data => {
      if (!mounted) return;
      setPapers(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(err => { if (mounted) { setError('Failed to load'); setLoading(false); } });
    return () => { mounted = false; };
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      loadPapers();
      return;
    }
    setLoading(true);
    try {
      const { searchPapers } = await import('@/lib/api');
      const data = await searchPapers(searchKeyword);
      setPapers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
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
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search papers..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/30 border-none outline-none focus:ring-2 focus:ring-[#274C77] placeholder-[#274C77]/70"
          />
          <button type="submit" className="px-4 py-2 bg-[#274C77] hover:bg-[#6096BA] text-white rounded-xl font-semibold transition-all">
            Search
          </button>
          {searchKeyword && (
            <button 
              type="button"
              onClick={() => { setSearchKeyword(''); loadPapers(); }}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all"
            >
              Clear
            </button>
          )}
        </form>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="ml-3 text-2xl font-bold text-[#274C77] hover:text-[#6096BA] transition"
          >
            ☰
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-center">Recent Papers</h2>
          <div className="text-sm text-[#274C77]/80">Last 7 days: <strong>{recentCount !== null ? recentCount : '—'}</strong></div>
        </div>

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
              { (loading ? [] : papers).map((paper, idx) => (
                <tr
                  key={idx}
                  className="border-t border-white/40 hover:bg-white/10 transition"
                >
                  <td className="p-3">{paper.title}</td>
                  <td className="p-3">{paper.authors || ''}</td>
                  <td className="p-3">{paper.tags || ''}</td>
                  <td className="p-3">{paper.year || ''}</td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => navigate(`/papers/${paper.id}`)}
                      className="px-4 py-2 rounded-xl bg-[#A3CEF1] hover:bg-[#6096BA] text-[#274C77] font-semibold transition-all"
                    >
                      View Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => navigate('/add-paper')}
            className="px-6 py-3 bg-[#274C77] hover:bg-[#6096BA] text-white rounded-full font-semibold shadow-md transition-all"
          >
            ➕ Add Paper
          </button>
        </div>
      </motion.section>

      {/* Sidebar with Backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop - Click outside to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            
            {/* Sidebar */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-64 backdrop-blur-2xl bg-white/30 border-l border-white/40 shadow-2xl flex flex-col p-6 text-[#274C77] z-50"
            >
              <div className="mb-10">
                <div className="font-bold text-lg">Menu</div>
              </div>

              <nav className="flex flex-col gap-6">
                <Link to="/my-papers" className="text-lg font-medium hover:text-[#6096BA] transition">
                  My Papers
                </Link>
                <Link to="/add-paper" className="text-lg font-medium hover:text-[#6096BA] transition">
                  Add Paper
                </Link>
                <Link to="/analytics" className="text-lg font-medium hover:text-[#6096BA] transition">
                  📊 Analytics
                </Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem('api_token');
                    localStorage.removeItem('user');
                    navigate('/');
                  }}
                  className="text-lg font-medium text-red-500 hover:text-red-400 transition mt-auto text-left"
                >
                  Logout
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
