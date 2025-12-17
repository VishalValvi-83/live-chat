import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TypingIndicator({ avatar, userName }) {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -8 },
  }

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex gap-2 mb-3"
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar} />
        <AvatarFallback className="text-xs">
          {userName?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="bg-card text-card-foreground rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-border/50">
        <div className="flex items-center gap-1">
          <motion.div
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{ ...dotTransition, delay: 0 }}
            className="h-2 w-2 rounded-full bg-muted-foreground/50"
          />
          <motion.div
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{ ...dotTransition, delay: 0.15 }}
            className="h-2 w-2 rounded-full bg-muted-foreground/50"
          />
          <motion.div
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{ ...dotTransition, delay: 0.3 }}
            className="h-2 w-2 rounded-full bg-muted-foreground/50"
          />
        </div>
      </div>
    </motion.div>
  )
}
