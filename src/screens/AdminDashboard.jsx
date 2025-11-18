import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // User form state
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);
  
  // Paper form state
  const [paperForm, setPaperForm] = useState({ title: '', abstract: '', year: '', url: '', pdf_key: '' });
  const [editingPaper, setEditingPaper] = useState(null);

  useEffect(() => {
    // Check if user is admin
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.is_admin) {
      navigate('/login');
      return;
    }
    
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchPapers();
    }
  }, [activeTab, navigate]);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('api_token')}`,
    'Content-Type': 'application/json'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/admin/users', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok) setUsers(data);
      else setError(data.error);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/admin/papers', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok) setPapers(data);
      else setError(data.error);
    } catch (err) {
      setError('Failed to fetch papers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/admin/users', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userForm)
      });
      const data = await res.json();
      if (res.ok) {
        setUserForm({ name: '', email: '', password: '' });
        fetchUsers();
        alert('User created successfully');
      } else {
        setError(data.error || 'Failed to create user');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userForm)
      });
      const data = await res.json();
      if (res.ok) {
        setUserForm({ name: '', email: '', password: '' });
        setEditingUser(null);
        fetchUsers();
        alert('User updated successfully');
      } else {
        setError(data.error || 'Failed to update user');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        fetchUsers();
        alert('User deleted successfully');
      } else {
        setError(data.error || 'Failed to delete user');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaper = async (e) => {
    e.preventDefault();
    if (!editingPaper) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/admin/papers/${editingPaper.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(paperForm)
      });
      const data = await res.json();
      if (res.ok) {
        setPaperForm({ title: '', abstract: '', year: '', url: '', pdf_key: '' });
        setEditingPaper(null);
        fetchPapers();
        alert('Paper updated successfully');
      } else {
        setError(data.error || 'Failed to update paper');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaper = async (paperId) => {
    if (!confirm('Are you sure you want to delete this paper?')) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/admin/papers/${paperId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        fetchPapers();
        alert('Paper deleted successfully');
      } else {
        setError(data.error || 'Failed to delete paper');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const startEditUser = (user) => {
    setEditingUser(user);
    setUserForm({ name: user.name, email: user.email, password: '' });
  };

  const startEditPaper = (paper) => {
    setEditingPaper(paper);
    setPaperForm({
      title: paper.title,
      abstract: paper.abstract || '',
      year: paper.year || '',
      url: paper.url || '',
      pdf_key: paper.pdf_key || ''
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('api_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/70 mt-1">Manage users and papers</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/analytics')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              📊 Analytics
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-white/70 hover:bg-white/5'
            }`}
          >
            Users Management
          </button>
          <button
            onClick={() => setActiveTab('papers')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'papers'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-white/70 hover:bg-white/5'
            }`}
          >
            Papers Management
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 text-white">
            {error}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Form */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Name</label>
                  <Input
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Email</label>
                  <Input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Password {editingUser && '(leave blank to keep current)'}
                  </label>
                  <Input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                    required={!editingUser}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={loading}
                  >
                    {editingUser ? 'Update' : 'Create'}
                  </Button>
                  {editingUser && (
                    <Button
                      type="button"
                      onClick={() => {
                        setEditingUser(null);
                        setUserForm({ name: '', email: '', password: '' });
                      }}
                      className="bg-white/10 hover:bg-white/20"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Users List */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">All Users</h2>
              {loading ? (
                <p className="text-white/70">Loading...</p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="text-white font-semibold">{user.name}</h3>
                        <p className="text-white/70 text-sm">{user.email}</p>
                        <p className="text-white/50 text-xs mt-1">
                          Papers: {user.paper_count} {user.is_admin && '• Admin'}
                        </p>
                      </div>
                      {!user.is_admin && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEditUser(user)}
                            className="bg-blue-500 hover:bg-blue-600 text-sm"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-500 hover:bg-red-600 text-sm"
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Papers Tab */}
        {activeTab === 'papers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Paper Form (only shown when editing) */}
            {editingPaper && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Edit Paper</h2>
                <form onSubmit={handleUpdatePaper} className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Title</label>
                    <Input
                      value={paperForm.title}
                      onChange={(e) => setPaperForm({ ...paperForm, title: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Abstract</label>
                    <textarea
                      value={paperForm.abstract}
                      onChange={(e) => setPaperForm({ ...paperForm, abstract: e.target.value })}
                      className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Year</label>
                    <Input
                      type="number"
                      value={paperForm.year}
                      onChange={(e) => setPaperForm({ ...paperForm, year: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">URL</label>
                    <Input
                      value={paperForm.url}
                      onChange={(e) => setPaperForm({ ...paperForm, url: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      disabled={loading}
                    >
                      Update
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setEditingPaper(null);
                        setPaperForm({ title: '', abstract: '', year: '', url: '', pdf_key: '' });
                      }}
                      className="bg-white/10 hover:bg-white/20"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Papers List */}
            <div className={editingPaper ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">All Papers</h2>
                {loading ? (
                  <p className="text-white/70">Loading...</p>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {papers.map((paper) => (
                      <div
                        key={paper.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{paper.title}</h3>
                            <p className="text-white/70 text-sm mt-1">
                              Year: {paper.year || 'N/A'} • Added by: {paper.added_by_name || 'Unknown'}
                            </p>
                            {paper.authors && (
                              <p className="text-white/60 text-xs mt-1">Authors: {paper.authors}</p>
                            )}
                            {paper.tags && (
                              <p className="text-white/60 text-xs">Tags: {paper.tags}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => startEditPaper(paper)}
                              className="bg-blue-500 hover:bg-blue-600 text-sm"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeletePaper(paper.id)}
                              className="bg-red-500 hover:bg-red-600 text-sm"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
