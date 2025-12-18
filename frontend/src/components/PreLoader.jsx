import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'
const PreLoader = ({ onComplete }) => {
  const containerRef = useRef(null)
  const [percentage, setPercentage] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const textCircles = [
    {
      text: "FULL STACK DEVELOPER • COMPUTER ENGINEER • CREATIVE DESIGNER •",
      radius: 160,
      duration: 15,
      direction: 1
    },
    {
      text: "REACT.JS • NODE.JS • MERN STACK • ANIMATION • ",
      radius: 120,
      duration: 10,
      direction: -1
    },
    {
      text: "PASSIONATE • INNOVATIVE • MINIMALIST • ARTISTIC • ",
      radius: 80,
      duration: 8,
      direction: 1
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Percentage counter animation
      const counter = { value: 0 }
      gsap.to(counter, {
        value: 100,
        duration: 3,
        ease: "power2.inOut",
        onUpdate: () => setPercentage(Math.round(counter.value)),
        onComplete: () => {
          setTimeout(() => {
            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 1,
              ease: "power2.inOut",
              onComplete: () => {
                setIsComplete(true)
                onComplete?.()
              }
            })
          }, 500)
        }
      })

      // Continuous rotation for each circle
      const circles = containerRef.current.querySelectorAll('.kinetic-circle')
      circles.forEach((circle, index) => {
        const config = textCircles[index]
        gsap.to(circle, {
          rotation: 360 * config.direction,
          duration: config.duration,
          repeat: -1,
          ease: "none"
        })
      })

      // Initial reveal
      gsap.from(".kinetic-letter", {
        opacity: 0,
        scale: 0,
        duration: 1,
        stagger: {
          each: 0.01,
          from: "random"
        },
        ease: "power3.out"
      })

      gsap.from(".percentage-text", {
        opacity: 0,
        scale: 0.5,
        duration: 1.5,
        ease: "back.out(1.7)"
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a] overflow-hidden ${isComplete ? 'pointer-events-none' : ''
        }`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Kinetic Typography Circles */}
        {textCircles.map((circleConfig, circleIndex) => (
          <div
            key={circleIndex}
            className="kinetic-circle absolute"
            style={{
              width: circleConfig.radius * 2,
              height: circleConfig.radius * 2
            }}
          >
            {circleConfig.text.split('').map((char, charIndex) => {
              const totalChars = circleConfig.text.length
              const angle = (charIndex / totalChars) * 360
              const x = Math.cos((angle * Math.PI) / 180) * circleConfig.radius
              const y = Math.sin((angle * Math.PI) / 180) * circleConfig.radius

              return (
                <span
                  key={charIndex}
                  className="kinetic-letter absolute text-[10px] sm:text-xs font-bold text-white tracking-widest whitespace-nowrap"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
                    fontFamily: "'Space Grotesk', sans-serif",
                    textTransform: 'uppercase',
                    opacity: 0.8 - (circleIndex * 0.2)
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              )
            })}
          </div>
        ))}

        {/* Center Percentage */}
        <div className="percentage-text flex flex-col items-center justify-center z-10">
          <span
            className="text-2xl font-light text-white tracking-tighter"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {percentage}%
          </span>
          <motion.div initial={{ opacity: 0 }}
            animate={{ opacity: 1, }}
            transition={{ delay: 0.3 }}
            className='text-[6px] tracking-[0.3em] text-white/40 mt-2'
          >MADE BY</motion.div>
          <motion.div initial={{ opacity: 0 }}
            animate={{ opacity: 1, }}
            transition={{ delay: 0.7 }}
            className="text-[10px] uppercase tracking-[0.3em] text-white/50"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            VISHAL VALVI
          </motion.div>
          <motion.div initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 0.5, width: 50 }}
            // whileInView={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className='mt-[2px] w-6 h-0.5 bg-white/30 rounded-full'>

          </motion.div>
        </div>

        {/* Aesthetic background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
      </div>
    </div>
  )
}

export default PreLoader