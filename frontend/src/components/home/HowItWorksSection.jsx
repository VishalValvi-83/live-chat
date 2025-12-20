import { motion } from "framer-motion"
import { useTheme } from "@/hooks/useTheme"
import { steps } from "@/data/homeData"

export default function HowItWorksSection() {
    const { resolvedTheme } = useTheme()
    const isDark = resolvedTheme === "dark"

    const textColor = isDark ? 'text-white' : 'text-slate-900'
    const textMuted2 = isDark ? 'text-white/50' : 'text-slate-500'
    const borderColor = isDark ? 'border-white/10' : 'border-slate-200'
    const cardBg = isDark ? 'from-white/5 to-white/[0.02]' : 'from-slate-100/80 to-slate-50/80'

    return (
        <section className="relative py-32 overflow-hidden">
            <div className="absolute inset-0" style={{ background: isDark ? 'linear-gradient(to bottom, #030712, #0a1628, #030712)' : 'linear-gradient(to bottom, #ffffff, #f8fafc, #ffffff)' }} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className={`text-4xl sm:text-5xl font-bold mb-6 ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        How it{" "}
                        <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                            Works
                        </span>
                    </h2>
                    <p className={`text-xl max-w-2xl mx-auto ${textMuted2}`}>
                        Get started in seconds, connect in moments
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((item, index) => (
                        <motion.div
                            key={item.step}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative"
                        >
                            {index < 2 && (
                                <div className="hidden md:block absolute top-1/2 right-0 w-full h-px transform translate-x-1/2 -translate-y-1/2" style={{ background: `linear-gradient(to right, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}, transparent)` }} />
                            )}
                            <div className={`relative bg-gradient-to-br ${cardBg} backdrop-blur-xl rounded-3xl p-8 border ${borderColor} text-center`}>
                                <div className={`text-6xl font-bold mb-4 ${isDark ? 'text-white/10' : 'text-slate-200'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                    {item.step}
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 items-center justify-center shadow-lg mb-4"
                                >
                                    <item.icon className="h-7 w-7 text-white" />
                                </motion.div>
                                <h3 className={`text-xl font-bold mb-2 ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                    {item.title}
                                </h3>
                                <p className={textMuted2}>{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}