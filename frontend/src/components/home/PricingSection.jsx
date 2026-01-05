import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/useTheme"
import { plans } from "@/data/homeData"

export default function PricingSection() {
    const { resolvedTheme, getBackgroundColor, getForegroundColor } = useTheme()
    const navigate = useNavigate()

    const isDark = resolvedTheme === "dark"
    const bgColor = getBackgroundColor()
    const fgColor = getForegroundColor()

    const textColor = isDark ? 'text-white' : 'text-slate-900'
    const textMuted = isDark ? 'text-white/60' : 'text-slate-600'
    const textMuted2 = isDark ? 'text-white/50' : 'text-slate-500'
    const borderColor = isDark ? 'border-white/10' : 'border-slate-200'
    const cardBg = isDark ? 'from-white/5 to-white/[0.02]' : 'from-slate-100/80 to-slate-50/80'
    const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'

    return (
        <section id="pricing" className="relative py-32 overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Simple,{" "}
                        <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                            transparent
                        </span>
                        {" "}pricing
                    </h2>
                    <p className={`text-xl ${textMuted2}`}>
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
                            whileHover={{ y: -10, scale: plan.popular ? 1 : 1.02 }}
                            className={`relative ${plan.popular ? 'md:-mt-8 md:mb-8' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                    <div className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-medium">
                                        Most Popular
                                    </div>
                                </div>
                            )}
                            <div className={`relative h-full flex flex-col justify-between bg-gradient-to-br ${cardBg} backdrop-blur-xl rounded-3xl p-8 border ${plan.popular ? 'border-blue-500/50 shadow-xl shadow-blue-500/10' : borderColor}`}>
                                <div className="mb-8">
                                    <div className="text-center mb-8">
                                        <h3 className={`text-2xl font-bold mb-2 ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{plan.name}</h3>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className={`text-5xl font-bold ${textColor}`}>{plan.price}</span>
                                            {plan.price !== "Custom" && (
                                                <span className={textMuted2}>/month</span>
                                            )}
                                        </div>
                                    </div>
                                    <ul className="space-y-4">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Check className="h-3 w-3 text-white" />
                                                </div>
                                                <span className={textMuted}>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button
                                    className={`w-full h-11 ${plan.popular ? "bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white" : `${hoverBg} border ${borderColor}`}`}
                                    style={!plan.popular ? { color: fgColor } : {}}
                                    size="lg"
                                    onClick={() => navigate("/register")}
                                >
                                    Get Started
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}