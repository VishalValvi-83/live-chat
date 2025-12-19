import { useNavigate } from "react-router-dom";
import { MessageCircle, Zap, Shield, Users } from "lucide-react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    // GSAP animation for background elements
    const tl = gsap.timeline();
    tl.fromTo(
      ".bg-shape",
      { opacity: 0, scale: 0.5, rotation: -180 },
      { opacity: 0.1, scale: 1, rotation: 0, duration: 1.5, ease: "back.out(1.7)" }
    )
      .fromTo(
        logoRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
        "-=1"
      )
      .fromTo(
        featuresRef.current.children,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" },
        "-=0.5"
      );
  }, []);


  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-around bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-8 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="bg-shape absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-10"></div>
      <div className="bg-shape absolute bottom-20 right-20 w-48 h-48 bg-violet-200 rounded-full opacity-10"></div>
      <div className="bg-shape absolute top-1/2 left-1/4 w-24 h-24 bg-green-200 rounded-full opacity-10"></div>

      <motion.div
        ref={containerRef}
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Animated Logo */}
        <motion.div
          ref={logoRef}
          className="flex items-center justify-center gap-2 mb-8"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <MessageCircle className="h-8 w-8 text-blue-500" />
          <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
            VoxenApp
          </span>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Join VoxenApp Today!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect, chat, and collaborate in real-time. Sign up now to unlock a world of seamless communication.
          </p>
        </motion.div>

        {/* Features List */}
        <motion.div
          ref={featuresRef}
          className="mb-8 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <Zap className="h-6 w-6 text-yellow-500" />
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Lightning Fast</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Instant messaging with zero lag.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <Shield className="h-6 w-6 text-green-500" />
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Secure & Private</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">End-to-end encryption for your peace of mind.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <Users className="h-6 w-6 text-blue-500" />
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Group Chats</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connect with friends, family, and teams effortlessly.</p>
            </div>
          </div>
        </motion.div>

        {/* Register Form */}

      </motion.div>
      <motion.div
        className="w-full max-w-md"
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <RegisterForm onLoginClick={handleLoginClick} />
      </motion.div>
    </div>
  );
}