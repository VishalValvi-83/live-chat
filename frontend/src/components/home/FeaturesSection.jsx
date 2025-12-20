import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTheme } from "@/hooks/useTheme"
import { features } from "@/data/homeData"

export default function FeaturesSection() {
    const { resolvedTheme, getAccentHex, getBackgroundColor } = useTheme()
    const featureRef = useRef(null)

    const isDark = resolvedTheme === "dark"
    const accentColor = getAccentHex()
    const bgColor = getBackgroundColor()

    const textColor = isDark ? 'text-white' : 'text-slate-900'
    const textMuted2 = isDark ? 'text-white/50' : 'text-slate-500'
    const borderColor = isDark ? 'border-white/10' : 'border-slate-200'
    const cardBg = isDark ? 'from-white/5 to-white/[0.02]' : 'from-slate-100/80 to-slate-50/80'

    const { scrollYProgress: featureScrollProgress } = useScroll({
        target: featureRef,
        offset: ["start end", "end start"],
    })

    return (
        <section id="features" ref={featureRef} className="relative py-32 overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
            <motion.div
                style={{ y: useTransform(featureScrollProgress, [0, 1], [150, -150]) }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px]" style={{ backgroundColor: `${accentColor}15` }} />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)' }} />
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Why choose{" "}
                        <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                            VoxenApp?
                        </span>
                    </h2>
                    <p className={`text-xl max-w-2xl mx-auto ${textMuted2}`}>
                        Built with security, speed, and simplicity in mind
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="relative group"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${index === 0 ? 'from-blue-500/20 to-cyan-500/20' : index === 1 ? 'from-violet-500/20 to-purple-500/20' : index === 2 ? 'from-emerald-500/20 to-teal-500/20' : 'from-pink-500/20 to-rose-500/20'} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            <div className={`relative bg-gradient-to-br ${cardBg} backdrop-blur-xl rounded-3xl p-8 border ${borderColor} h-full`}>
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    className={`inline-flex h-14 w-14 rounded-2xl ${index === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : index === 1 ? 'bg-gradient-to-br from-violet-500 to-purple-500' : index === 2 ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gradient-to-br from-pink-500 to-rose-500'} items-center justify-center shadow-lg mb-6`}
                                >
                                    <feature.icon className="h-7 w-7 text-white" />
                                </motion.div>
                                <h3 className={`text-2xl font-bold mb-3 ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                    {feature.title}
                                </h3>
                                <p className={`leading-relaxed ${textMuted2}`}>
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}