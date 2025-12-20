import { motion } from "framer-motion"
import { Heart, Quote, Star } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { testimonials } from "@/data/homeData"

export default function TestimonialsSection() {
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
        <div className="absolute inset-0" style={{ background: isDark ? 'linear-gradient(to bottom, #030712, #0a1628, #030712)' : 'linear-gradient(to bottom, #ffffff, #f8fafc, #ffffff)' }} />
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
              <Heart className="w-4 h-4 text-pink-400" />
              <span className={`text-sm ${textMuted}`}>Loved by millions</span>
            </motion.div>
            <h2 className={`text-4xl sm:text-5xl font-bold mb-6 ${textColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              What Our{" "}
              <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                Users Say
              </span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${textMuted2}`}>
              Join millions of satisfied users worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className={`relative bg-gradient-to-br ${cardBg} backdrop-blur-xl rounded-3xl p-8 border ${borderColor} h-full`}>
                  <Quote className="w-8 h-8 mb-4" style={{ color: `${accentColor}50` }} />
                  <p className={`leading-relaxed mb-6 ${textMuted}`}>
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center font-bold text-white">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className={`font-medium ${textColor}`}>{testimonial.name}</div>
                      <div className={`text-sm ${textMuted3}`}>{testimonial.role}</div>
                    </div>
                    <div className="ml-auto flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8"
          >
            {[
              { value: "4.9", label: "App Store Rating" },
              { value: "4.8", label: "Play Store Rating" },
              { value: "50M+", label: "Downloads" },
              { value: "190", label: "Countries" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-center px-8"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className={`text-sm mt-1 ${textMuted3}`}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
    </section>
  )
}