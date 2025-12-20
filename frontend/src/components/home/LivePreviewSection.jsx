import { motion } from "framer-motion"
import { MessageCircle, Users, Phone, Video, Paperclip, Smile, Send, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useTheme } from "@/hooks/useTheme"
import { liveConversation, livePreviewFeatures } from "@/data/homeData"

export default function LivePreviewSection() {
    const { resolvedTheme, getAccentHex, getBackgroundColor } = useTheme()
    const isDark = resolvedTheme === "dark"
    const accentColor = getAccentHex()
    const bgColor = getBackgroundColor()

    const textColor = isDark ? 'text-white' : 'text-slate-900'
    const textMuted = isDark ? 'text-white/60' : 'text-slate-600'
    const textMuted2 = isDark ? 'text-white/50' : 'text-slate-500'
    const textMuted3 = isDark ? 'text-white/40' : 'text-slate-400'
    const borderColor = isDark ? 'border-white/10' : 'border-slate-200'
    const cardBg = isDark ? 'from-white/5 to-white/[0.02]' : 'from-slate-100/80 to-slate-50/80'

    return (
        <section className="relative py-32 overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${borderColor}`}
                        style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                    >
                        <MessageCircle className="w-4 h-4" style={{ color: accentColor }} />
                        <span className={`text-sm ${textMuted}`}>Live Preview</span>
                    </motion.div>
                    <h2 className={`text-4xl sm:text-5xl font-bold mb-6 ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Experience{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                            Real Conversations
                        </span>
                    </h2>
                    <p className={`text-xl max-w-2xl mx-auto ${textMuted2}`}>
                        See how seamlessly teams communicate with VoxenApp
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Chat UI Mock */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-3xl blur-3xl" />
                        <div className={`relative bg-gradient-to-br ${cardBg} backdrop-blur-xl rounded-3xl border ${borderColor} overflow-hidden`}>
                            <div className={`flex items-center justify-between px-6 py-4 border-b ${borderColor}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className={`font-medium ${textColor}`}>Team Alpha</div>
                                        <div className={`text-xs flex items-center gap-1 ${textMuted3}`}>
                                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                            4 members online
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <motion.button whileHover={{ scale: 1.1 }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                        <Phone className={`w-4 h-4 ${textMuted}`} />
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.1 }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                        <Video className={`w-4 h-4 ${textMuted}`} />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4 min-h-[320px]">
                                {liveConversation.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.15 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${msg.avatar === "A" ? "bg-blue-500" : msg.avatar === "S" ? "bg-pink-500" : "bg-emerald-500"}`}>
                                            {msg.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-sm font-medium ${textColor}`}>{msg.sender}</span>
                                                <span className={`text-xs ${textMuted3}`}>{msg.time}</span>
                                            </div>
                                            <div className={`rounded-2xl rounded-tl-sm px-4 py-2 text-sm inline-block ${textMuted}`} style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                                {msg.message}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8 }}
                                    className={`flex items-center gap-2 text-xs ${textMuted3}`}
                                >
                                    <div className="flex gap-1">
                                        {[0, 0.15, 0.3].map((delay, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }}
                                                animate={{ y: [0, -3, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity, delay: delay }}
                                            />
                                        ))}
                                    </div>
                                    Sarah is typing...
                                </motion.div>
                            </div>

                            <div className={`px-6 py-4 border-t ${borderColor} flex items-center gap-3`}>
                                <motion.button whileHover={{ scale: 1.1 }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                    <Paperclip className={`w-4 h-4 ${textMuted}`} />
                                </motion.button>
                                <div className={`flex-1 rounded-full px-4 py-2 text-sm ${textMuted3}`} style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                    Type a message...
                                </div>
                                <motion.button whileHover={{ scale: 1.1 }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                    <Smile className={`w-4 h-4 ${textMuted}`} />
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.1 }} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center">
                                    <Send className="w-4 h-4 text-white" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        {livePreviewFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-4"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center flex-shrink-0">
                                    <feature.icon className="w-6 h-6" style={{ color: accentColor }} />
                                </div>
                                <div>
                                    <h4 className={`text-lg font-bold mb-1 ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        {feature.title}
                                    </h4>
                                    <p className={`text-sm leading-relaxed ${textMuted2}`}>{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}

                        <Link to="/demo">
                            <motion.div
                                className="inline-flex items-center gap-2 transition-colors group cursor-pointer"
                                style={{ color: accentColor }}
                                whileHover={{ x: 5 }}
                            >
                                Try the interactive demo
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}