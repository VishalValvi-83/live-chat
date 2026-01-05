import { useRef, useLayoutEffect } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Video, ArrowRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useTheme } from "@/hooks/useTheme"
import { communicationFeatures } from "@/data/homeData"

gsap.registerPlugin(ScrollTrigger)

export default function CommunicationSection() {
    const { resolvedTheme, getAccentHex } = useTheme()
    const communicationRef = useRef(null)
    const stickyBgRef = useRef(null)
    const bgOrbLeftRef = useRef(null)
    const bgOrbRightRef = useRef(null)
    const timelineItemsRef = useRef([])

    const isDark = resolvedTheme === "dark"
    const accentColor = getAccentHex()

    const textColor = isDark ? 'text-white' : 'text-slate-900'
    const textMuted = isDark ? 'text-white/60' : 'text-slate-600'
    const textMuted2 = isDark ? 'text-white/50' : 'text-slate-500'
    const borderColor = isDark ? 'border-white/10' : 'border-slate-200'
    const cardBg = isDark ? 'from-white/5 to-white/[0.02]' : 'from-slate-100/80 to-slate-50/80'

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // GSAP Logic for Background and Orbs
    useLayoutEffect(() => {
        if (prefersReducedMotion || !communicationRef.current) return

        const ctx = gsap.context(() => {
            // Background gradient slow drift
            gsap.fromTo(stickyBgRef.current, { y: -60 }, {
                y: 60, ease: "none",
                scrollTrigger: { trigger: communicationRef.current, start: "top bottom", end: "bottom top", scrub: 1 }
            })
            // Right orb
            gsap.fromTo(bgOrbRightRef.current, { y: -120 }, {
                y: 120, ease: "none",
                scrollTrigger: { trigger: communicationRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 }
            })
            // Left orb
            gsap.fromTo(bgOrbLeftRef.current, { y: 160 }, {
                y: -160, ease: "none",
                scrollTrigger: { trigger: communicationRef.current, start: "top bottom", end: "bottom top", scrub: 1 }
            })
        }, communicationRef)
        return () => ctx.revert()
    }, [])

    // GSAP Logic for Timeline Items
    useLayoutEffect(() => {
        if (!communicationRef.current) return
        const ctx = gsap.context(() => {
            timelineItemsRef.current.forEach((item, index) => {
                if (!item) return;
                const direction = index % 2 === 0 ? -1 : 1

                // Card parallax
                const card = item.querySelector(".parallax-card")
                if (card) {
                    gsap.fromTo(card, { y: 80 * direction }, {
                        y: -80 * direction, ease: "none",
                        scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1 }
                    })
                }

                // Text parallax
                const text = item.querySelector(".parallax-text")
                if (text) {
                    gsap.fromTo(text, { y: -40 * direction }, {
                        y: 40 * direction, ease: "none",
                        scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1 }
                    })
                }

                // Icon micro depth
                const icon = item.querySelector(".parallax-icon")
                if (icon) {
                    gsap.fromTo(icon, { y: 20 }, {
                        y: -20, ease: "none",
                        scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 0.8 }
                    })
                }
            })
        }, communicationRef)
        return () => ctx.revert()
    }, [])

    const addToRefs = (el) => {
        if (el && !timelineItemsRef.current.includes(el)) {
            timelineItemsRef.current.push(el)
        }
    }

    // Scroll Progress for Timeline Line
    const { scrollYProgress: communicationScrollProgress } = useScroll({
        target: communicationRef,
        offset: ["start center", "end center"],
    })

    const { scrollYProgress: bgScrollProgress } = useScroll({
        target: communicationRef,
        offset: ["start end", "end start"],
    })

    const rawHeight = useTransform(communicationScrollProgress, [0, 1], ["0%", "100%"])
    const lineHeight = useSpring(rawHeight, { stiffness: 120, damping: 30 })

    return (
        <section id="communication" ref={communicationRef} className="relative py-32 overflow-hidden">
            {/* Sticky background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="sticky top-0 h-screen w-full">
                    <div
                        ref={stickyBgRef}
                        className="absolute inset-0"
                        style={{ background: isDark ? "linear-gradient(to bottom, #030712, #0a1628, #030712)" : "linear-gradient(to bottom, #ffffff, #f8fafc, #ffffff)" }}
                    />
                    {/* Floating orbs */}
                    <div ref={bgOrbRightRef} className="absolute top-1/3 right-[-200px] w-[600px] h-[600px] rounded-full blur-[160px]" style={{ backgroundColor: `${accentColor}22` }} />
                    <div ref={bgOrbLeftRef} className="absolute bottom-1/4 left-[-150px] w-[500px] h-[500px] rounded-full blur-[140px]" style={{ backgroundColor: isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(139, 92, 246, 0.08)" }} />
                </div>
            </div>

            {/* Floating background blobs (synced with outer scroll) */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ y: useTransform(bgScrollProgress, [0, 1], [100, -100]) }}
            >
                <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full blur-[150px]" style={{ backgroundColor: `${accentColor}15` }} />
                <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ backgroundColor: isDark ? "rgba(139, 92, 246, 0.1)" : "rgba(139, 92, 246, 0.05)" }} />
            </motion.div>

            {/* Timeline Line */}
            <div className="absolute left-1/2 top-[420px] bottom-32 w-[2px] hidden lg:block">
                <div className="absolute inset-0 bg-gray-300/30 rounded-full" />
                <motion.div
                    className="absolute top-0 left-0 w-full rounded-full"
                    style={{ height: lineHeight, background: accentColor, boxShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}80` }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${borderColor}`}
                        style={{ backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)" }}
                    >
                        <Video className="w-4 h-4" style={{ color: accentColor }} />
                        <span className={`text-sm ${textMuted}`}>Multiple ways to connect</span>
                    </motion.div>
                    <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        More Than Just{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">Messaging</span>
                    </h2>
                    <p className={`text-xl max-w-2xl mx-auto ${textMuted2}`}>
                        Video calls, voice calls, voice messages — communicate the way that works best for you
                    </p>
                </motion.div>

                <div className="space-y-24 relative z-10">
                    {communicationFeatures.map((feature, index) => {
                        const isEven = index % 2 === 0
                        return (
                            <motion.div
                                ref={addToRefs}
                                key={feature.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className={`relative flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 lg:gap-20`}
                            >
                                {/* Timeline dot */}
                                <motion.div
                                    className="absolute left-[49.5%] hidden lg:block z-20"
                                    style={{
                                        top: "50%",
                                        transform: "translate(-50%, -50%)" // Centers both horizontally and vertically
                                    }}
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1  }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <div
                                        className="w-4 h-4 rounded-full border-4 border-white"
                                        style={{
                                            backgroundColor: accentColor,
                                            boxShadow: `0 0 15px ${accentColor}, 0 0 30px ${accentColor}40`
                                        }}
                                    />
                                </motion.div>

                                {/* Card */}
                                <motion.div
                                    className="flex-1 relative group parallax-card"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 rounded-3xl blur-3xl group-hover:opacity-30 transition-opacity`} />
                                    <div className={`relative  bg-gradient-to-br ${cardBg} backdrop-blur-xl rounded-3xl p-8 border ${borderColor} overflow-hidden`}>
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400/50" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                                            <div className="w-3 h-3 rounded-full bg-green-400/50" />
                                        </div>
                                        <motion.div
                                            className={`h-64 w-72 sm:w-full flex items-center justify-center bg-gradient-to-br ${feature.color} opacity-10 rounded-2xl`}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <motion.div
                                                animate={{ y: [0, -10, 0], rotate: [0, 5, 0, -5, 0] }}
                                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <feature.icon className={`h-24 w-24 bg-gradient-to-br ${feature.color} bg-clip-text`} style={{ color: "currentColor", opacity: 0.8 }} strokeWidth={1.5} />
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Text */}
                                <div className={`flex-1 space-y-6 parallax-text ${isEven ? "lg:pl-16" : "lg:pr-16"}`}>
                                    <motion.div
                                        whileHover={{ scale: 1.05, rotate: 5 }}
                                        className={`inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} items-center justify-center shadow-lg parallax-icon`}
                                    >
                                        <feature.icon className="h-7 w-7 text-white" />
                                    </motion.div>
                                    <div>
                                        <div className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${feature.color} bg-opacity-20 text-xs font-medium mb-3 ${textMuted}`}>
                                            {feature.stats}
                                        </div>
                                        <h3 className={`text-3xl lg:text-4xl font-bold mb-4 ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                            {feature.title}
                                        </h3>
                                        <p className={`text-lg leading-relaxed ${textMuted2}`}>
                                            {feature.description}
                                        </p>
                                    </div>
                                    <motion.button
                                        className={`inline-flex items-center gap-2 transition-colors group ${textMuted}`}
                                        whileHover={{ x: 5 }}
                                    >
                                        Learn more
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}