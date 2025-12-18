import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import gsap from "gsap"

export default function DemoPreloader({ onComplete }) {
  const containerRef = useRef(null)
  const messagesRef = useRef(null)
  const [isExiting, setIsExiting] = useState(false)

  const chatMessages = [
    { text: "Hey! How's it going?", sender: "left", delay: 0 },
    { text: "Great! Just finished the project", sender: "right", delay: 0.4 },
    { text: "That's awesome! Can we hop on a call?", sender: "left", delay: 0.8 },
    { text: "Sure! Video or voice?", sender: "right", delay: 1.2 },
    { text: "Video would be perfect!", sender: "left", delay: 1.6 },
    { text: "Connecting...", sender: "center", delay: 2.0 },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsExiting(true)
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 1.1,
            filter: "blur(20px)",
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
              if (onComplete) onComplete()
            }
          })
        }
      })

      gsap.fromTo(".chat-bubble",
        { 
          opacity: 0, 
          y: 30,
          scale: 0.8,
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
          stagger: 0.5
        }
      )

      gsap.to(".typing-indicator", {
        opacity: 1,
        duration: 0.3,
        delay: 0.3,
        repeat: -1,
        yoyo: true
      })

      tl.to({}, { duration: 3.5 })

    }, containerRef)

    return () => ctx.revert()
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          style={{ backgroundColor: "#0a0a0a" }}
        >
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 w-full max-w-md px-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Starting Demo
              </h2>
              <p className="text-white/50 text-sm">Watch how conversations come to life</p>
            </motion.div>

            <div 
              ref={messagesRef}
              className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-6 border border-white/10 min-h-[300px]"
            >
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                <div className="w-3 h-3 rounded-full bg-green-400/50" />
              </div>

              <div className="pt-6 space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`chat-bubble flex ${
                      message.sender === "left" ? "justify-start" : 
                      message.sender === "right" ? "justify-end" : "justify-center"
                    }`}
                    style={{ opacity: 0 }}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                        message.sender === "left"
                          ? "bg-white/10 text-white rounded-bl-sm"
                          : message.sender === "right"
                          ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-br-sm"
                          : "bg-emerald-500/20 text-emerald-400 text-sm"
                      }`}
                    >
                      {message.sender === "center" ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-2 h-2 bg-emerald-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                          />
                          {message.text}
                        </div>
                      ) : (
                        message.text
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex justify-start typing-indicator" style={{ opacity: 0 }}>
                  <div className="bg-white/10 px-4 py-2 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-white/50 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-white/50 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-white/50 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.5 }}
              className="mt-6 flex justify-center"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </motion.div>
                <div className="text-white/50 text-sm">Initializing video call...</div>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <motion.div
                className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Loading demo experience
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
