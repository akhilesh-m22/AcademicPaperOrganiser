import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function AdminLoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login({ email, password });
      if (res.token) {
        // Check if user is admin
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.is_admin) {
          navigate('/admin/dashboard');
        } else {
          setError('Access denied. Admin privileges required.');
          localStorage.removeItem('api_token');
          localStorage.removeItem('user');
        }
      } else if (res.error) {
        setError(res.error || 'Login failed');
      } else if (res.errors) {
        setError(res.errors.map(x => x.msg).join(', '));
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-md text-white"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="text-white/70 mt-2">
            Secure Administrator Access
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-2 font-medium">Admin Email</label>
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-red-500 text-white placeholder:text-white/50"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Password</label>
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-red-500 text-white placeholder:text-white/50"
            />
          </div>
          
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full mt-4 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 transition-all"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Admin Sign In'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link 
            to="/login" 
            className="text-sm text-white/70 hover:text-white font-medium underline"
          >
            ← Back to User Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
