import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/useTheme"

export default function CTASection() {
    const { resolvedTheme, getBackgroundColor } = useTheme()
    const isDark = resolvedTheme === "dark"
    const bgColor = getBackgroundColor()

    return (
        <section className="relative py-32 overflow-hidden">
            <div className="absolute inset-0" style={{ background: isDark ? 'linear-gradient(to bottom, #030712, #0a1628)' : 'linear-gradient(to bottom, #ffffff, #f8fafc)' }} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-pink-500/20 rounded-3xl blur-3xl" />
                    <div className="relative bg-gradient-to-r from-blue-500 to-violet-500 rounded-3xl p-12 text-center overflow-hidden">
                        <motion.div
                            className="absolute inset-0 opacity-30"
                            style={{
                                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
                                backgroundSize: '30px 30px'
                            }}
                        />
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 relative z-10" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Ready to get started?
                        </h2>
                        <p className="text-xl mb-8 text-white/90 relative z-10">
                            Join thousands of users already chatting on VoxenApp
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                            <Link to="/register">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 px-8">
                                        Create Free Account
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link to="/chats" state={{ isdemo: true }}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                                        Try Demo
                                    </Button>
                                </motion.div>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}