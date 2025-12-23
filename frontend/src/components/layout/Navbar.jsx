import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { MessageCircle } from 'lucide-react'
import { useTheme } from "@/hooks/useTheme"






const Navbar = () => {
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
    const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b" style={{ backgroundColor: `${bgColor}cc`, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="h-6 w-6" style={{ color: accentColor }} />
                        <span className={`font-bold text-xl ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>VoxenApp</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className={`${textMuted} hover:${textColor} transition-colors text-sm`}>Features</a>
                        <a href="#communication" className={`${textMuted} hover:${textColor} transition-colors text-sm`}>Communication</a>
                        <a href="#pricing" className={`${textMuted} hover:${textColor} transition-colors text-sm`}>Pricing</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className={`${textMuted} hover:${textColor} ${hoverBg}`}>Sign in</Button>
                        </Link>
                        <Link to="/register">
                            <Button style={{ backgroundColor: accentColor }} className="text-white hover:opacity-90">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar