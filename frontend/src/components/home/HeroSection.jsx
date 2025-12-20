import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import { Sparkles, ArrowRight, Play } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/useTheme"

export default function HeroSection({ preloaderComplete }) {
    const { resolvedTheme, getAccentHex, getBackgroundColor } = useTheme()
    const heroRef = useRef(null)

    const isDark = resolvedTheme === "dark"
    const accentColor = getAccentHex()
    const bgColor = getBackgroundColor()

    // Styles
    const textColor = isDark ? 'text-white' : 'text-slate-900'
    const textMuted = isDark ? 'text-white/60' : 'text-slate-600'
    const textMuted2 = isDark ? 'text-white/50' : 'text-slate-500'
    const borderColor = isDark ? 'border-white/10' : 'border-slate-200'
    const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'

    // Mouse/Background animation logic
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const bgX = useSpring(mouseX, { damping: 50, stiffness: 100 })
    const bgY = useSpring(mouseY, { damping: 50, stiffness: 100 })

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    })

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

    return (
        <motion.section
            ref={heroRef}
            style={{ opacity, scale }}
            className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center"
            onMouseMove={(e) => {
                const rect = heroRef.current.getBoundingClientRect()
                const x = (e.clientX - rect.left - rect.width / 2) / rect.width
                const y = (e.clientY - rect.top - rect.height / 2) / rect.height
                mouseX.set(x * 50)
                mouseY.set(y * 50)
            }}
        >
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px]"
                    style={{ x: bgX, y: bgY, backgroundColor: `${accentColor}33` }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
                    style={{ x: useTransform(bgX, v => -v), y: useTransform(bgY, v => -v), backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)' }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px]"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ backgroundColor: isDark ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.05)' }}
                />
            </div>

            <div className="max-w-7xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={preloaderComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={preloaderComplete ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${borderColor}`}
                        style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                    >
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className={`text-sm ${textMuted}`}>Now with HD Video Calling</span>
                    </motion.div>

                    <motion.h1
                        className={`text-5xl sm:text-6xl lg:text-8xl font-bold leading-tight ${textColor}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={preloaderComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Connect with{" "}
                        <span className="relative">
                            <motion.span
                                className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent"
                                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                style={{ backgroundSize: '200% 100%' }}
                            >
                                everyone
                            </motion.span>
                            <motion.div
                                className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-pink-500/20 blur-xl -z-10"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                        </span>
                        <br />
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={preloaderComplete ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className={isDark ? 'text-white/90' : 'text-slate-800'}
                        >
                            securely & instantly
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        className={`text-xl max-w-2xl mx-auto leading-relaxed ${textMuted}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={preloaderComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        Chat, call, and video conference with anyone around the world.
                        End-to-end encrypted, blazing fast, and beautifully designed.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={preloaderComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        <Link to="/register">
                            <motion.div
                                className="relative group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="absolute -inset-1 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(to right, ${accentColor}, #8b5cf6)` }} />
                                <Button size="lg" className="relative text-white px-8 py-6 text-lg" style={{ background: `linear-gradient(to right, ${accentColor}, ${accentColor}dd)` }}>
                                    Start Chatting Free
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </motion.div>
                        </Link>

                        <Link to="/demo">
                            <motion.div
                                className={`flex items-center gap-3 px-6 py-3 rounded-xl border cursor-pointer transition-colors ${borderColor} ${hoverBg}`}
                                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                                    <Play className={`w-4 h-4 ml-0.5 ${textMuted}`} />
                                </div>
                                <span className={textMuted}>Watch Demo</span>
                            </motion.div>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={preloaderComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {[
                            { value: "2M+", label: "Active Users" },
                            { value: "500M+", label: "Messages Sent" },
                            { value: "99.9%", label: "Uptime" },
                            { value: "150+", label: "Countries" }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 + index * 0.1 }}
                            >
                                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className={`text-sm mt-1 ${textMuted2}`}>{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className={`w-6 h-10 rounded-full border-2 flex justify-center pt-2 ${borderColor}`}>
                    <motion.div
                        className="w-1 h-2 rounded-full"
                        style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }}
                        animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </motion.section>
    )
}