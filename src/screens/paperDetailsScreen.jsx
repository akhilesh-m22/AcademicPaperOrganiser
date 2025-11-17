import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPaperById, updatePaper, deletePaper } from "@/lib/api";

export default function PaperDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    if (id) {
      fetchPaperById(id).then(data => { 
        if (mounted) { 
          setPaper(data); 
          setLoading(false); 
        } 
      }).catch(() => { if (mounted) setLoading(false); });
    } else {
      setLoading(false);
    }
    return () => { mounted = false; };
  }, [id]);

  // Check if current user owns this paper
  const isOwner = currentUser && paper && (paper.added_by === currentUser.id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaper({ ...paper, [name]: value });
  };

  const handleSave = async () => {
    if (!currentUser) {
      setError('Please login to edit papers');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        title: paper.title,
        abstract: paper.abstract,
        year: paper.year ? Number(paper.year) : null,
        url: paper.url,
        pdf_key: paper.pdf_key || paper.pdfKey
      };
      const res = await updatePaper(id, payload);
      if (res.success) {
        setSuccess('Paper updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(null), 3000);
      } else if (res.error) {
        setError(res.error);
      } else if (res.errors) {
        setError(res.errors.map(e => e.msg).join(', '));
      }
    } catch (err) {
      setError('Failed to update paper. Please login first.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUser) {
      setError('Please login to delete papers');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this paper? This action cannot be undone.')) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await deletePaper(id);
      if (res.success) {
        alert('Paper deleted successfully!');
        navigate('/my-papers');
      } else if (res.error) {
        setError(res.error);
      }
    } catch (err) {
      setError('Failed to delete paper. Please login first.');
    } finally {
      setSaving(false);
    }
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
          {loading && <div className="text-center">Loading...</div>}
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-700">
              {success}
            </div>
          )}

          {!loading && paper && Object.entries({
            title: paper.title,
            abstract: paper.abstract,
            year: paper.year,
            url: paper.url,
            pdfKey: paper.pdf_key || paper.pdfKey,
            authors: (paper.authors || []).map?.(a=>a.name).join(', ') || (paper.authors || '').toString(),
            tags: (paper.tags || []).map?.(t=>t.name).join(', ') || (paper.tags || '').toString(),
            references: (paper.references || []).join ? (paper.references || []).join(', ') : (paper.references || '')
          }).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</label>
              {key === "abstract" ? (
                <textarea
                  name={key}
                  value={value || ''}
                  onChange={handleChange}
                  disabled={!isEditing || ['authors', 'tags', 'references'].includes(key)}
                  rows="4"
                  className={`w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50 resize-none ${!isEditing || ['authors', 'tags', 'references'].includes(key) ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              ) : (
                <input
                  type="text"
                  name={key}
                  value={value || ''}
                  onChange={handleChange}
                  disabled={!isEditing || ['authors', 'tags', 'references'].includes(key)}
                  className={`w-full px-4 py-3 bg-white/40 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] outline-none placeholder-[#274C77]/50 ${!isEditing || ['authors', 'tags', 'references'].includes(key) ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              )}
            </div>
          ))}

          {!currentUser && (
            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-xl text-yellow-700 text-center">
              Please <button onClick={() => navigate('/')} className="underline font-semibold hover:text-yellow-800">login</button> to edit or delete papers
            </div>
          )}

          {currentUser && !isOwner && (
            <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-xl text-blue-700 text-center">
              You can only edit papers that you added. This paper was added by another user.
            </div>
          )}

          <div className="mt-8 flex justify-center gap-6">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !isOwner}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-semibold shadow-md transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => isOwner ? setIsEditing(true) : setError('You can only edit your own papers')}
                  disabled={!isOwner}
                  className="px-6 py-3 bg-[#274C77] hover:bg-[#6096BA] text-white rounded-full font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving || !isOwner}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Deleting...' : '🗑️ Delete'}
                </button>
              </>
            )}
          </div>
        </form>
      </motion.section>
    </div>
  );
}