import { motion } from "framer-motion"
import { Check, CheckCheck, Image as ImageIcon, FileText, Mic } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function MessageBubble({
  content,
  timestamp,
  isSent,
  type = "text",
  status = "read",
  avatar,
  userName,
}) {
  const bubbleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  const renderMessageContent = () => {
    switch (type) {
      case "image":
        return (
          <div className="space-y-2">
            <div className="relative h-48 w-64 overflow-hidden rounded-lg bg-muted">
              <div className="flex h-full items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            {content && <p className="text-sm">{content}</p>}
          </div>
        )
      case "audio":
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/50">
              <Mic className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="h-1 w-32 rounded-full bg-background/30">
                <div className="h-full w-1/3 rounded-full bg-background/60" />
              </div>
            </div>
            <span className="text-xs">0:15</span>
          </div>
        )
      case "file":
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/50">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{content}</p>
              <p className="text-xs opacity-70">2.4 MB</p>
            </div>
          </div>
        )
      default:
        return <p className="whitespace-pre-wrap break-words text-sm">{content}</p>
    }
  }

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex gap-2 mb-3",
        isSent ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!isSent && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar} />
          <AvatarFallback className="text-xs">
            {userName?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm",
          isSent
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
            : "bg-card text-card-foreground rounded-bl-md border border-border/50"
        )}
      >
        {renderMessageContent()}
        
        <div className={cn(
          "flex items-center justify-end gap-1 mt-1.5",
          isSent ? "text-white/70" : "text-muted-foreground"
        )}>
          <span className="text-xs">{timestamp}</span>
          {isSent && (
            <span>
              {status === "sent" && <Check className="h-3.5 w-3.5" />}
              {status === "delivered" && <CheckCheck className="h-3.5 w-3.5" />}
              {status === "read" && <CheckCheck className="h-3.5 w-3.5 text-blue-200" />}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
