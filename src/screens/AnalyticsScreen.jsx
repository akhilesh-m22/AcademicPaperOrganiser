import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getPapersByYear, getPapersWithManyAuthors } from "@/lib/api";

export default function AnalyticsScreen() {
  const navigate = useNavigate();
  const [papersByYear, setPapersByYear] = useState([]);
  const [papersWithManyAuthors, setPapersWithManyAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('byYear');

  useEffect(() => {
    const token = localStorage.getItem('api_token');
    if (!token) {
      navigate('/');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [yearData, authorsData] = await Promise.all([
        getPapersByYear(),
        getPapersWithManyAuthors()
      ]);
      setPapersByYear(Array.isArray(yearData) ? yearData : []);
      setPapersWithManyAuthors(Array.isArray(authorsData) ? authorsData : []);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#E7ECEF] via-[#A3CEF1] to-[#6096BA] text-[#274C77] p-6">
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
          📊 Analytics & Statistics
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-[#274C77] hover:bg-[#6096BA] text-white rounded-xl font-semibold transition-all"
        >
          ← Back to Dashboard
        </button>
      </motion.header>

      {/* Tabs */}
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-2 mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('byYear')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'byYear'
              ? 'bg-[#274C77] text-white'
              : 'text-[#274C77] hover:bg-white/30'
          }`}
        >
          📅 Papers by Year
        </button>
        <button
          onClick={() => setActiveTab('manyAuthors')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'manyAuthors'
              ? 'bg-[#274C77] text-white'
              : 'text-[#274C77] hover:bg-white/30'
          }`}
        >
          👥 Papers with Many Authors
        </button>
      </div>

      {/* Content */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 flex-1 overflow-auto"
      >
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl font-semibold">Loading analytics...</div>
          </div>
        ) : (
          <>
            {/* Papers by Year Tab */}
            {activeTab === 'byYear' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Papers Grouped by Year</h2>
                <p className="text-sm text-[#274C77]/70 mb-6">
                  This aggregate query groups papers by publication year and shows statistics including paper count, unique authors, tags, and contributors.
                </p>
                
                {papersByYear.length === 0 ? (
                  <div className="text-center py-8 text-[#274C77]/70">
                    No data available
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-[#E7ECEF]/40">
                          <th className="p-3 text-left font-semibold">Year</th>
                          <th className="p-3 text-left font-semibold">Paper Count</th>
                          <th className="p-3 text-left font-semibold">Unique Authors</th>
                          <th className="p-3 text-left font-semibold">Unique Tags</th>
                          <th className="p-3 text-left font-semibold">Contributors</th>
                        </tr>
                      </thead>
                      <tbody>
                        {papersByYear.map((row, idx) => (
                          <tr
                            key={idx}
                            className="border-t border-white/40 hover:bg-white/10 transition"
                          >
                            <td className="p-3 font-bold text-lg">{row.year}</td>
                            <td className="p-3">
                              <span className="px-3 py-1 bg-blue-500/20 rounded-full font-semibold">
                                {row.paper_count}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="px-3 py-1 bg-green-500/20 rounded-full font-semibold">
                                {row.unique_authors}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="px-3 py-1 bg-purple-500/20 rounded-full font-semibold">
                                {row.unique_tags}
                              </span>
                            </td>
                            <td className="p-3 text-sm">{row.contributors || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Papers with Many Authors Tab */}
            {activeTab === 'manyAuthors' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Papers with Above-Average Authors</h2>
                <p className="text-sm text-[#274C77]/70 mb-6">
                  This nested query finds papers that have more authors than the average, using a subquery to calculate the average author count.
                </p>
                
                {papersWithManyAuthors.length === 0 ? (
                  <div className="text-center py-8 text-[#274C77]/70">
                    No papers with above-average author count found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {papersWithManyAuthors.map((paper, idx) => (
                      <motion.div
                        key={paper.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl p-6 hover:bg-white/40 transition cursor-pointer"
                        onClick={() => navigate(`/papers/${paper.id}`)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold flex-1">{paper.title}</h3>
                          <span className="px-4 py-2 bg-orange-500/30 border border-orange-500/50 rounded-full font-bold text-orange-700 ml-4">
                            {paper.author_count} Authors
                          </span>
                        </div>
                        <div className="text-sm text-[#274C77]/80 mb-2">
                          <strong>Year:</strong> {paper.year || 'N/A'}
                        </div>
                        <div className="text-sm text-[#274C77]/70">
                          <strong>Authors:</strong> {paper.authors}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </motion.section>
    </div>
  );
}
