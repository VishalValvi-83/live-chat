import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from "../../api/authApi"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export function LoginForm({ onRegisterClick }) {
  const { registered, data } = useLocation().state || {};
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusField, setFocusField] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    if (registered && data) {
      setEmail(data || "");
    }
  }, [registered, data]);
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await loginUser({ email, password })

      if (res && res.status === 200) {
        toast.success(res?.data?.message || "Login successful!")
        setEmail("")
        setPassword("")
        navigate("/chats");
      } else {
        toast.error(res?.data?.message || "Login failed. Please try again.")
      }
    } catch (error) {
      console.error("Login failed:", error)
      toast.error("Login failed. Please check your credentials and try again.")
    } finally {
      setIsLoading(false)
    }

  }

  const containerVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-screen space-y-6 bg-white/80 dark:dark:bg-slate-800 rounded-2xl shadow-xl px-6 py-8 backdrop-blur-md border border-neutral-200 dark:border-neutral-800"
      style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)" }}
    >
      {/* Animated background shapes */}
      <div className="bg-shape absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-10"></div>
      <div className="bg-shape absolute bottom-20 right-20 w-48 h-48 bg-violet-200 rounded-full opacity-10"></div>
      <div className="bg-shape absolute top-1/2 left-1/4 w-24 h-24 bg-green-200 rounded-full opacity-10"></div>

      <motion.div variants={itemVariants} className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to continue to your account</p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className={`relative transition-all duration-300 ${focusField === "email" ? "ring-2 ring-blue-400/60 bg-white/90 dark:bg-neutral-800/80" : ""} rounded-xl`}>
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusField("email")}
              onBlur={() => setFocusField("")}
              className="pl-10 py-3 rounded-xl bg-transparent focus:bg-white/95 dark:focus:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-700 focus:border-blue-400 transition-all duration-300"
              required
              autoComplete="off"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className={`relative transition-all duration-300 ${focusField === "password" ? "ring-2 ring-blue-400/60 bg-white/90 dark:bg-neutral-800/80" : ""} rounded-xl`}>
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusField("password")}
              onBlur={() => setFocusField("")}
              className="pl-10 pr-10 py-3 rounded-xl bg-transparent focus:bg-white/95 dark:focus:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-700 focus:border-blue-400 transition-all duration-300"
              required
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus:outline-none"
              tabIndex={-1}
            >
              <AnimatePresence mode="wait" initial={false}>
                {showPassword ? (
                  <motion.span key="eyeoff" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }}>
                    <EyeOff className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span key="eye" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }}>
                    <Eye className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileTap={{ scale: 0.97 }} className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold text-base shadow-glow-sm hover:shadow-glow-md transition-all duration-300 group"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Signing in...
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  Sign in
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </motion.form>

      <motion.div variants={itemVariants} className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <motion.button
          type="button"
          onClick={onRegisterClick}
          className="font-medium text-primary hover:text-primary/70 transition-colors underline-offset-2 hover:underline"
          whileTap={{ scale: 0.96 }}
        >
          Create account
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
