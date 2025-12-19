import { useState } from "react"
import { registerUser } from "@/api/authApi"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, Phone, Upload, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function RegisterForm({ onSubmit, onLoginClick }) {
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusField, setFocusField] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const payload = { full_name: fullName, username, email, phone, password }
      const response = await registerUser(payload)

      if (response && response.data) {
        onSubmit?.(response.data)
      } else {
        onSubmit?.(payload)
      }
    } catch (error) {
      console.error("Registration failed", error)
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
      className="w-full max-w-screen space-y-6 bg-white/80 dark:dark:bg-slate-800  rounded-2xl shadow-xl px-6 py-8 backdrop-blur-md border border-neutral-200 dark:border-neutral-800"
      style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)" }}
    >
      <motion.div variants={itemVariants} className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Create account</h1>
        <p className="text-muted-foreground">Sign up to start chatting</p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* <motion.div variants={itemVariants} className="flex justify-center">
          <div className="relative">
            <Avatar className="h-24 w-24 cursor-pointer">
              <AvatarFallback className="text-2xl bg-muted">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <Upload className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div> */}

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className={`relative transition-all duration-300 ${focusField === "fullName" ? "ring-2 ring-blue-400/60 bg-white/90 dark:bg-neutral-800/80" : ""} rounded-xl`}>
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onFocus={() => setFocusField("fullName")}
              onBlur={() => setFocusField("")}
              className="pl-10 py-3 rounded-xl bg-transparent focus:bg-white/95 dark:focus:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-700 focus:border-blue-400 transition-all duration-300"
              required
              autoComplete="off"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className={`relative transition-all duration-300 ${focusField === "username" ? "ring-2 ring-blue-400/60 bg-white/90 dark:bg-neutral-800/80" : ""} rounded-xl`}>
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="username"
              type="text"
              placeholder="Choose a username, e.g., johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusField("username")}
              onBlur={() => setFocusField("")}
              className="pl-10 py-3 rounded-xl bg-transparent focus:bg-white/95 dark:focus:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-700 focus:border-blue-400 transition-all duration-300"
              required
              autoComplete="off"
            />
          </div>
        </motion.div>

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
          <Label htmlFor="phone">Phone (optional)</Label>
          <div className={`relative transition-all duration-300 ${focusField === "phone" ? "ring-2 ring-blue-400/60 bg-white/90 dark:bg-neutral-800/80" : ""} rounded-xl`}>
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={() => setFocusField("phone")}
              onBlur={() => setFocusField("")}
              className="pl-10 py-3 rounded-xl bg-transparent focus:bg-white/95 dark:focus:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-700 focus:border-blue-400 transition-all duration-300"
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
              placeholder="Create a password"
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

        {/* <motion.div variants={itemVariants} className="pt-2">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 focus:ring-2 focus:ring-blue-400/60 focus:outline-none"
              disabled={isLoading}
              style={{ boxShadow: "0 2px 8px 0 rgba(31, 38, 135, 0.10)" }}
            >
              {isLoading ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Creating account...
                </motion.span>
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Create account
                </motion.span>
              )}
            </Button>
          </motion.div>
        </motion.div> */}

        <motion.div variants={itemVariants} whileTap={{ scale: 0.97 }} className="pt-4">
          <Button
            // ref={buttonRef}
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
                  Creating account...
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}

                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  Create account
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </motion.form>

      <motion.div variants={itemVariants} className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <motion.button
          type="button"
          onClick={onLoginClick}
          className="font-medium text-blue-500 hover:text-blue-600 transition-colors underline-offset-2 hover:underline"
          whileTap={{ scale: 0.96 }}
        >
          Sign in
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
