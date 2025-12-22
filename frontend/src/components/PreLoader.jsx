import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const PreLoader = ({ onComplete }) => {
  const containerRef = useRef(null)
  const [percentage, setPercentage] = useState(0)
  const [isDark, setIsDark] = useState(true)
  const [accentColor, setAccentColor] = useState('#60a5fa')

  const circleTexts = [
    "REAL-TIME CHAT • VIDEO CALLING • VOICE MESSAGES • ",
    "GROUP CHATS • END-TO-END ENCRYPTED • SECURE • ",
    "INSTANT MESSAGING • GLOBAL REACH • HD QUALITY • "
  ]

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark"
    const savedAccent = localStorage.getItem("accentColor") || "blue"

    let dark = false
    if (savedTheme === "dark") {
      dark = true
    } else if (savedTheme === "system") {
      dark = window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    setIsDark(dark)

    const hexMap = {
      blue: { light: "#3b82f6", dark: "#60a5fa" },
      green: { light: "#22c55e", dark: "#4ade80" },
      purple: { light: "#a855f7", dark: "#c084fc" },
      pink: { light: "#ec4899", dark: "#f472b6" },
      orange: { light: "#f97316", dark: "#fb923c" },
      red: { light: "#ef4444", dark: "#f87171" },
    }
    setAccentColor(hexMap[savedAccent]?.[dark ? 'dark' : 'light'] || hexMap.blue[dark ? 'dark' : 'light'])
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const circles = containerRef.current.querySelectorAll('.orbit-circle')
      const percentageEl = containerRef.current.querySelector('.percentage-text')

      gsap.set(circles, {
        scale: 0.5,
        opacity: 0
      })

      gsap.set(percentageEl, {
        opacity: 0,
        scale: 0.8
      })

      gsap.to(circles, {
        scale: 1,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
      })

      gsap.to(percentageEl, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out"
      })

      gsap.to(circles[0], {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      })

      gsap.to(circles[1], {
        rotation: -360,
        duration: 25,
        repeat: -1,
        ease: "none"
      })

      gsap.to(circles[2], {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "none"
      })

      gsap.to({ val: 0 }, {
        val: 100,
        duration: 3,
        ease: "power1.inOut",
        onUpdate: function () {
          const newVal = Math.round(this.targets()[0].val)
          setPercentage(newVal)
        },
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
              onComplete?.()
            }
          })
        }
      })

    }, containerRef)

    return () => ctx.revert()
  }, [onComplete])

  const bgColor = isDark ? '#030712' : '#ffffff'
  const textColor = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
  const textColorMedium = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
  const textColorLight = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)'
  const percentageColor = isDark ? '#ffffff' : '#0f172a'

  const createCircularText = (text, radius, index) => {
    const chars = text.split('')
    const angleStep = 360 / chars.length
    const colors = [textColor, textColorMedium, textColorLight]

    return chars.map((char, i) => {
      const angle = i * angleStep - 90
      const rad = (angle * Math.PI) / 180
      const x = Math.cos(rad) * radius
      const y = Math.sin(rad) * radius

      return (
        <span
          key={`${index}-${i}`}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
            color: colors[index],
            fontSize: index === 0 ? '11px' : index === 1 ? '10px' : '9px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            letterSpacing: '0.15em'
          }}
        >
          {char}
        </span>
      )
    })
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative w-[420px] h-[420px] sm:w-[520px] sm:h-[520px]">
        <div
          className="orbit-circle absolute inset-0"
          style={{ transformOrigin: 'center center' }}
        >
          <div className="relative w-full h-full">
            {createCircularText(circleTexts[0], 240, 0)}
          </div>
        </div>

        <div
          className="orbit-circle absolute inset-0"
          style={{ transformOrigin: 'center center' }}
        >
          <div className="relative w-full h-full">
            {createCircularText(circleTexts[1], 180, 1)}
          </div>
        </div>

        <div
          className="orbit-circle absolute inset-0"
          style={{ transformOrigin: 'center center' }}
        >
          <div className="relative w-full h-full">
            {createCircularText(circleTexts[2], 120, 2)}
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="percentage-text text-4xl font-light tracking-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: percentageColor
            }}
          >
            {percentage}%
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-full opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
            transform: 'scale(0.8)'
          }}
        />
      </div>
    </div>
  )
}

export default PreLoader
