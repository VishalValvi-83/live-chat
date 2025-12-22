import { MessageCircle } from 'lucide-react'
import { useTheme } from "@/hooks/useTheme"
import { motion } from "framer-motion"

const Footer = () => {
    const { resolvedTheme, getAccentHex, getBackgroundColor, getForegroundColor, getMutedColor } = useTheme()
    const isDark = resolvedTheme === "dark"
    const accentColor = getAccentHex()
    const bgColor = getBackgroundColor()
    const fgColor = getForegroundColor()
    const mutedColor = getMutedColor()

    const textColor = isDark ? 'text-white' : 'text-slate-900'
    const textMuted = isDark ? 'text-white/60' : 'text-slate-600'
    const textMuted2 = isDark ? 'text-white/50' : 'text-slate-500'
    const textMuted3 = isDark ? 'text-white/40' : 'text-slate-400'
    const borderColor = isDark ? 'border-white/10' : 'border-slate-200'
    const cardBg = isDark ? 'from-white/5 to-white/[0.02]' : 'from-slate-100/80 to-slate-50/80'
    const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'


    const links = [
        { name: "FEATURES", href: "#features" },
        { name: "COMMUNICATION", href: "#communication" },
        { name: "PRICING", href: "#pricing" },
        // { name: "EXPERTISE", href: "#expertise" },
    ]


    return (
        <footer className="relative py-16 px-4 sm:px-6 lg:px-8 selection:bg-slate-100 dark:selection:bg-slate-900" style={{ backgroundColor: bgColor, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>

            <div className="flex items-center mx-auto justify-center gap-2 mb-4">
                <MessageCircle className="h-5 w-5" style={{ color: accentColor }} />
                <span className={`font-bold ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>VoxenApp</span>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap justify-center gap-6 mb-8">
                    {links.map((link, index) => (
                        <a key={index} href={link.href} className={`text-sm ${textMuted2} ${hoverBg} px-3 py-1 rounded transition-colors cursor-pointer`}>{link.name}</a>
                    ))}
                </div>
            </div>
            <div className='text-gray-600 font-thin text-center mb-2'>CODE BY</div>
            <motion.div
                className="text-center mb-6 overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
            >

                <div
                    className={`text-6xl md:text-8xl tracking-tight ${textColor}`}
                    style={{ fontFamily: "'Playfair Display', sans-serif", fontWeight: 'lighter !important' }}
                >
                    {"VISHAL VALVI".split("").map((char, index) => (
                        <motion.span
                            key={index}
                            className="inline-block selection:bg-slate-100 selection:text-gray-400 dark:selection:bg-slate-900"
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.05,
                                ease: [0.33, 1, 0.68, 1]
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </div>
            </motion.div>

            {/* Social Links */}
            <div className="flex justify-center gap-8 mb-6 ">
                <a href="https://www.linkedin.com/in/vishal-valvi-b325522a7/" className={`text-sm ${textMuted2} underline underline-offset-2  px-2 py-1 rounded transition-colors cursor-pointer`} target='_blank'>LINKEDIN</a>
                <a href="https://www.instagram.com/v.i.s.h.a.l__83/" className={`text-sm ${textMuted2} underline underline-offset-2 px-2 py-1 rounded transition-colors cursor-pointer`} target='_blank'>INSTAGRAM</a>
                <a href="https://github.com/VishalValvi-83" className={`text-sm ${textMuted2} underline underline-offset-2 px-2 py-1 rounded transition-colors cursor-pointer`} target='_blank'>GITHUB</a>
            </div>

            {/* Email */}
            <div className="text-center mb-12">
                <a href='mailto:VALVI0315@GMAIL.COM' className={`text-sm font-sans font-semibold tracking-wide`}>EMAIL: VALVI0315@GMAIL.COM</a>
            </div>

            {/* Title */}
            <motion.div
                className="text-center mb-12 overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h3
                    className={`text-4xl md:text-6xl font-bold tracking-tight ${textMuted}`}
                    style={{ fontFamily: "'Playfair Display', sans-serif", letterSpacing: '2px' }}
                >
                    {"FULL STACK DEVELOPER".split("").map((char, index) => (
                        <motion.span
                            key={index}
                            className="inline-block selection:bg-slate-100 selection:text-gray-400 dark:selection:bg-slate-900"
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5,
                                delay: 0.3 + (index * 0.03),
                                ease: [0.33, 1, 0.68, 1]
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </h3>
            </motion.div>

            {/* Footer Bottom */}
            <div className={`flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t text-xs ${textMuted3}`} style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                <p>2025 All right reserved. Vishal Valvi.</p>
                {/* <div>
                        <span className={textMuted3}>Code by - </span>
                        <a href="" className={`${textColor} underline`}>VVV</a>
                    </div> */}
                <div></div>
            </div>

        </footer >
    )
}

export default Footer