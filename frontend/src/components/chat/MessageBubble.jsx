import { motion } from "framer-motion"
import { Check, CheckCheck, Image as ImageIcon, FileText, Mic } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import CustomAudioPlayer from "./CustomAudioPlayer"

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

          <CustomAudioPlayer content={content} />
          // <div className="flex items-center gap-3 min-w-[280px]">
          //   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/50">
          //     <Mic className="h-5 w-5" />
          //   </div>
          //   <audio
          //     controls
          //     src={content}
          //     className="w-full h-8 "
          //     onPlay={(e) => e.currentTarget.play()}

          //   // Custom styling for audio element can be tricky, 
          //   // but this ensures it works on all browsers.
          //   />
          // </div>
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
            ? "bg-gradient-to-br from-primary to- text-white rounded-br-md"
            : "bg-primary-foreground text-card-foreground rounded-bl-md border border-border/50"
        )}
      >
        {renderMessageContent()}

        <div className={cn(
          "flex items-center justify-end gap-1 mt-1.5",
          isSent ? "text-white/70" : "text-muted-foreground"
        )}>
          <span className="text-xs text-secondary-foreground">{timestamp}</span>
          {isSent && (
            <span>
              {status === "sent" && <Check className="h-3.5 w-3.5" />}
              {status === "delivered" && <CheckCheck className="h-3.5 w-3.5" />}
              {status === "read" && <CheckCheck className="h-3.5 w-3.5 text-blue-800" />}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
