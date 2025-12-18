import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { MessageCircle, Shield, Zap, Users, Lock, Check } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const containerRef = useRef(null)
  const featureRef = useRef(null)
  const heroRef = useRef(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  const bgX = useSpring(mouseX, { damping: 50, stiffness: 100 })
  const bgY = useSpring(mouseY, { damping: 50, stiffness: 100 })

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setCursorPos({ x: e.clientX, y: e.clientY })

      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        mouseX.set(x * 50)
        mouseY.set(y * 50)
        setMousePos({ x: x * 30, y: y * 30 })
      }
    }
    window.addEventListener("mousemove", moveCursor)
    return () => window.removeEventListener("mousemove", moveCursor)
  }, [cursorX, cursorY, mouseX, mouseY])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const { scrollYProgress: featureScrollProgress } = useScroll({
    target: featureRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  const featureY = useTransform(featureScrollProgress, [0, 1], [100, -100])
  const featureOpacity = useTransform(featureScrollProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const features = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Your messages are secured with industry-leading encryption",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time messaging with zero lag, instant delivery",
    },
    {
      icon: Users,
      title: "Group Chats",
      description: "Create groups and chat with multiple friends at once",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data stays yours. No tracking, no data selling",
    },
  ]

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "Unlimited 1-on-1 chats",
        "Group chats (up to 50)",
        "Voice messages",
        "File sharing (10MB)",
      ],
    },
    {
      name: "Pro",
      price: "$9",
      popular: true,
      features: [
        "Everything in Free",
        "Group chats (up to 500)",
        "File sharing (100MB)",
        "Video calls",
        "Custom themes",
        "Priority support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Everything in Pro",
        "Unlimited groups",
        "Advanced admin controls",
        "SSO integration",
        "Dedicated support",
      ],
    },
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 cursor-none">
      <motion.div
        className="fixed w-8 h-8 rounded-full border-2 border-blue-500 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: "-50%",
          y: "-50%",
        }}
      />

      <motion.div
        className="fixed w-2 h-2 rounded-full bg-blue-500 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: cursorX,
          top: cursorY,
          x: "-50%",
          y: "-50%",
        }}
      />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-blue-500" />
              <span className="font-bold text-xl">ChatApp</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-500 hover:bg-blue-600">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <motion.section
        ref={heroRef}
        style={{
          opacity,
          scale,
          rotateX: useTransform(bgY, [-50, 50], [2, -2]),
          rotateY: useTransform(bgX, [-50, 50], [-3, 3])
        }}
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            x: bgX,
            y: bgY,
            scale: useTransform(bgX, [-50, 50], [1, 1.05]),
          }}
        >
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
              backgroundSize: '200% 200%'
            }}
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            x: useTransform(bgX, [-50, 50], [-25, 25]),
            y: useTransform(bgY, [-50, 50], [-25, 25]),
            background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(59, 130, 246, 0.2), transparent 40%)`
          }}
        />

        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"
          style={{
            x: useTransform(bgX, [-50, 50], [-80, 80]),
            y: useTransform(bgY, [-50, 50], [-80, 80]),
            scale: useTransform(bgX, [-50, 50], [0.8, 1.2])
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]"
          style={{
            x: useTransform(bgX, [-50, 50], [80, -80]),
            y: useTransform(bgY, [-50, 50], [80, -80]),
            scale: useTransform(bgY, [-50, 50], [1.2, 0.8])
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]"
          style={{
            x: useTransform(bgX, [-50, 50], [40, -40]),
            y: useTransform(bgY, [-50, 50], [40, -40]),
            rotate: useTransform(bgX, [-50, 50], [-30, 30])
          }}
        />

        <motion.div
          className="max-w-7xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
            style={{
              transformStyle: "preserve-3d"
            }}
          >
            <motion.div className="inline-block">
              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Connect with{" "}
                <motion.span
                  className="relative inline-block bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 bg-clip-text text-transparent cursor-pointer"
                  whileHover={{
                    scale: 1.08,
                    rotate: [0, -2, 2, 0],
                  }}
                  animate={{
                    rotateY: [0, 5, -5, 0],
                    rotateX: [0, -2, 2, 0]
                  }}
                  transition={{
                    scale: { type: "spring", stiffness: 400, damping: 10 },
                    rotate: { duration: 0.5, ease: "easeInOut" },
                    rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                  }}
                >
                  <motion.span
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      backgroundImage: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #a855f7, #3b82f6)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    everyone
                  </motion.span>
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-purple-500/20 blur-xl -z-10"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  securely and instantly
                </motion.span>
              </motion.h1>
            </motion.div>

            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{
                x: useTransform(bgX, [-50, 50], [-3, 3]),
                y: useTransform(bgY, [-50, 50], [-3, 3]),
                z: 20
              }}
            >
              The modern chat application that respects your privacy while keeping
              you connected with friends, family, and colleagues.
            </motion.p>

            <motion.div
              className="flex items-center justify-center gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              style={{
                x: useTransform(bgX, [-50, 50], [-2, 2]),
                y: useTransform(bgY, [-50, 50], [-2, 2]),
                z: 25
              }}
            >
              <Link to="/register">
                <motion.div
                  className="relative group cursor-pointer"
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    rotateX: 10,
                    rotateY: -5
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                  }}
                >
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg blur-lg opacity-50 group-hover:opacity-100"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <Button size="lg" className="relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-2xl overflow-hidden">
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                    <span className="relative z-10">Start Chatting</span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/chats">
                <motion.div
                  className="relative group cursor-pointer"
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    rotateX: -10,
                    rotateY: 5,
                    borderColor: "rgba(59, 130, 246, 0.8)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                  }}
                >
                  <Button size="lg" variant="outline" className="relative overflow-hidden border-2 backdrop-blur-sm">
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-transparent"
                      initial={{ x: '-100%', opacity: 0 }}
                      whileHover={{ x: '100%', opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="relative z-10">View Demo</span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 relative"
            style={{
              transformStyle: "preserve-3d",
              perspective: "2000px",
              x: useTransform(bgX, [-50, 50], [15, -15]),
              y: useTransform(bgY, [-50, 50], [15, -15]),
              rotateX: useTransform(bgY, [-50, 50], [5, -5]),
              rotateY: useTransform(bgX, [-50, 50], [-8, 8])
            }}
          >
            {/* <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-950 h-32 bottom-0 z-10" /> */}

            <motion.div
              className="relative bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-purple-500/10 rounded-3xl p-8 border border-border/50 backdrop-blur-xl shadow-2xl overflow-hidden group cursor-pointer"
              whileHover={{
                scale: 1.03,
                rotateX: 5,
                rotateY: 5,
                z: 50,
                boxShadow: "0 30px 90px rgba(59, 130, 246, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                transformStyle: "preserve-3d"
              }}
            >
              <motion.div
                className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  x: [0, 20, 0],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  x: [0, -20, 0],
                  y: [0, 20, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                {[
                  { value: "2M+", label: "Active Users", color: "blue", delay: 0 },
                  { value: "500M+", label: "Messages Sent", color: "violet", delay: 0.1 },
                  { value: "99.9%", label: "Uptime", color: "emerald", delay: 0.2 }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg overflow-hidden group/stat cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 + stat.delay }}
                    whileHover={{
                      y: -16,
                      scale: 1.08,
                      rotateX: 10,
                      rotateY: index === 0 ? -10 : index === 1 ? 0 : 10,
                      z: 50,
                      boxShadow: stat.color === "blue" ? "0 20px 50px rgba(59, 130, 246, 0.4)" :
                        stat.color === "violet" ? "0 20px 50px rgba(139, 92, 246, 0.4)" :
                          "0 20px 50px rgba(16, 185, 129, 0.4)"
                    }}
                    style={{
                      transformStyle: "preserve-3d"
                    }}
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover/stat:opacity-10 transition-opacity duration-500 ${stat.color === "blue" ? "from-blue-500 to-cyan-500" :
                          stat.color === "violet" ? "from-violet-500 to-purple-500" :
                            "from-emerald-500 to-teal-500"
                        }`}
                    />

                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className={`absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-20 ${stat.color === "blue" ? "bg-blue-500" :
                          stat.color === "violet" ? "bg-violet-500" :
                            "bg-emerald-500"
                        } blur-2xl`}
                    />

                    <motion.div
                      className={`text-4xl font-bold relative z-10 ${stat.color === "blue" ? "text-blue-500" :
                          stat.color === "violet" ? "text-violet-500" :
                            "text-emerald-500"
                        }`}
                      whileHover={{
                        scale: 1.1,
                        filter: "brightness(1.2)"
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-muted-foreground mt-2 relative z-10 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      <section ref={featureRef} className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

        <motion.div
          style={{
            y: useTransform(featureScrollProgress, [0, 1], [150, -150]),
            opacity: useTransform(featureScrollProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
          }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px]" />
        </motion.div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-violet-200 bg-clip-text text-transparent">
              Why choose ChatApp?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Built with security, speed, and simplicity in mind
            </p>
          </motion.div>

          <div className="space-y-32">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0
              const featureY = useTransform(
                featureScrollProgress,
                [0, 0.3, 0.7, 1],
                [100 + index * 50, 0, 0, -100 - index * 50]
              )
              const imageY = useTransform(
                featureScrollProgress,
                [0, 0.3, 0.7, 1],
                [150 + index * 60, 50, -50, -200 - index * 60]
              )
              const imageRotate = useTransform(
                featureScrollProgress,
                [0, 0.5, 1],
                [isEven ? -5 : 5, 0, isEven ? 5 : -5]
              )

              return (
                <motion.div
                  key={feature.title}
                  style={{ y: featureY }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
                >
                  <motion.div
                    className="flex-1 relative group cursor-pointer"
                    whileHover={{ scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                      transformStyle: "preserve-3d",
                      perspective: "1500px"
                    }}
                  >
                    <motion.div
                      style={{ y: imageY, rotate: imageRotate }}
                      className="relative"
                      whileHover={{
                        rotateY: isEven ? 8 : -8,
                        rotateX: 5,
                        z: 60
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${index === 0 ? 'from-blue-500/20 to-cyan-500/20' :
                          index === 1 ? 'from-violet-500/20 to-purple-500/20' :
                            index === 2 ? 'from-emerald-500/20 to-teal-500/20' :
                              'from-pink-500/20 to-rose-500/20'
                        } rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500`} />

                      <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <motion.div
                          className={`relative h-64 flex items-center justify-center ${index === 0 ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10' :
                              index === 1 ? 'bg-gradient-to-br from-violet-500/10 to-purple-500/10' :
                                index === 2 ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10' :
                                  'bg-gradient-to-br from-pink-500/10 to-rose-500/10'
                            } rounded-2xl`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <motion.div
                            animate={{
                              y: [0, -10, 0],
                              rotate: [0, 5, 0, -5, 0]
                            }}
                            transition={{
                              duration: 6,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <feature.icon className={`h-32 w-32 ${index === 0 ? 'text-blue-400' :
                                index === 1 ? 'text-violet-400' :
                                  index === 2 ? 'text-emerald-400' :
                                    'text-pink-400'
                              }`} strokeWidth={1.5} />
                          </motion.div>
                        </motion.div>

                        <div className="absolute top-4 right-4 flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400/50" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                          <div className="w-3 h-3 rounded-full bg-green-400/50" />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="flex-1 space-y-6"
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`inline-flex h-16 w-16 rounded-2xl ${index === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                          index === 1 ? 'bg-gradient-to-br from-violet-500 to-purple-500' :
                            index === 2 ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                              'bg-gradient-to-br from-pink-500 to-rose-500'
                        } items-center justify-center shadow-lg shadow-current/20`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>

                    <div>
                      <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <motion.div
                      className="flex gap-2 pt-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`h-1 rounded-full ${index === 0 ? 'bg-blue-500/30' :
                              index === 1 ? 'bg-violet-500/30' :
                                index === 2 ? 'bg-emerald-500/30' :
                                  'bg-pink-500/30'
                            }`}
                          initial={{ width: 0 }}
                          whileInView={{ width: i === 0 ? 60 : i === 1 ? 40 : 20 }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div
          style={{
            y: useTransform(featureScrollProgress, [0, 1], [-100, 100]),
          }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
        />
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-slate-100 dark:to-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that works for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-card border rounded-2xl p-8 relative ${plan.popular
                    ? "border-blue-500 shadow-xl scale-105"
                    : "border-border/50"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${plan.popular
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : ""
                    }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-500 to-violet-500 rounded-3xl p-12 text-white"
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join millions of users already chatting on ChatApp
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="secondary">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/chats">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Try Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-foreground">ChatApp</span>
          </div>
          <p>© 2024 ChatApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
