import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPaper } from "@/lib/api";

export default function AddPaper() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [year, setYear] = useState('');
  const [url, setUrl] = useState('');
  const [pdfKey, setPdfKey] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [references, setReferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem('api_token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

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
          title="Go Back"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">Add Your Paper</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-2xl hover:text-[#6096BA] transition"
          title="Go Home"
        >
          🏠
        </button>
      </motion.header>

      {/* Form Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8"
      >
        <form className="space-y-5" onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setLoading(true);
          try {
            const payload = {
              title,
              abstract,
              year: year ? Number(year) : undefined,
              url,
              pdf_key: pdfKey,
              authors: author,
              tags,
              references
            };
            const res = await createPaper(payload);
            if (res && res.id) navigate(`/papers/${res.id}`);
            else if (res && res.errors) setError(res.errors.map(x => x.msg).join(', '));
            else if (res && res.error) setError(res.error);
          } catch (err) {
            setError('Network error');
          } finally { setLoading(false); }
        }}>
          <div>
            <label className="block text-sm font-medium mb-1">Title:</label>
            <input
              type="text"
              placeholder="Enter paper title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Abstract:</label>
            <textarea
              rows="4"
              placeholder="Enter abstract"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50 resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Year:</label>
              <input
                type="number"
                placeholder="2025"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL:</label>
              <input
                type="url"
                placeholder="Enter paper URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
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
                value={pdfKey}
                onChange={(e) => setPdfKey(e.target.value)}
                className="w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author:</label>
              <input
                type="text"
                placeholder="Enter author name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags:</label>
            <input
              type="text"
              placeholder="e.g., AI, NLP, Data Science"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">References:</label>
            <input
              type="text"
              placeholder="Add reference links or IDs"
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              className="w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50"
            />
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-[#274C77] hover:bg-[#6096BA] text-white rounded-full font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Saving...' : '💾 Save Paper'}
            </button>
          </div>
        </form>
      </motion.section>
    </div>
  );
}
