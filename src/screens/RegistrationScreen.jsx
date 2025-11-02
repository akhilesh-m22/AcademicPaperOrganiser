import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UserRegistration() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E7ECEF] via-[#A3CEF1] to-[#6096BA] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-10 w-full max-w-md text-[#274C77]"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>
        <p className="text-center text-[#274C77]/80 mb-8">
          User Registration
        </p>

        <form className="space-y-5">
          <div>
            <label className="block text-sm mb-2 font-medium">Full Name</label>
            <Input
              type="text"
              placeholder="Enter your name"
              className="bg-white/30 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] text-[#274C77]"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/30 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] text-[#274C77]"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              className="bg-white/30 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] text-[#274C77]"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Confirm Password</label>
            <Input
              type="password"
              placeholder="Confirm your password"
              className="bg-white/30 border-none rounded-xl focus:ring-2 focus:ring-[#274C77] text-[#274C77]"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-4 py-3 rounded-xl text-white font-semibold bg-[#274C77] hover:bg-[#6096BA] transition-all"
          >
            Register
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[#274C77]/70">
          Already have an account? <Link to="/" className="underline font-medium">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}
