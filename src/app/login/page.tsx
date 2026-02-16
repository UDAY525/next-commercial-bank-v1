"use client";
import React from "react";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      {/* 1. Main Card with Framer Motion Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100"
      >
        {/* 2. Red Accent Bar */}
        <div className="h-2 w-full bg-red-600" />

        <div className="p-8 md:p-12 flex flex-col items-center">
          {/* 3. Animated Logo Section */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6"
          >
            <LogIn className="w-8 h-8 text-red-600" />
          </motion.div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm mb-8 text-center">
            Sign in to your account using your Google identity
          </p>

          {/* 4. Google Login Button with Hover/Tap Effects */}
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#fafafa" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn()}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-gray-300 rounded-xl text-gray-700 font-medium transition-all shadow-sm hover:shadow-md active:shadow-inner"
          >
            <img
              src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Continue with Google</span>
          </motion.button>

          {/* 5. Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 pt-6 border-t border-gray-100 w-full text-center"
          >
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
              Secure Authentication
            </p>
            <div className="flex justify-center gap-4 text-xs font-semibold text-red-600">
              <a href="#" className="hover:underline">
                Support
              </a>
              <span className="text-gray-300">•</span>
              <a href="#" className="hover:underline">
                Privacy
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle Background Red Glow */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-red-50 rounded-full blur-3xl -z-10 opacity-60" />
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-red-50 rounded-full blur-3xl -z-10 opacity-60" />
    </div>
  );
};

export default LoginPage;
