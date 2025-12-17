import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function ChatListItem({
  id,
  avatar,
  name,
  lastMessage,
  timestamp,
  unreadCount = 0,
  isOnline = false,
  isActive = false,
  onClick,
}) {
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-border/30",
        isActive && "bg-accent/50"
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar} />
          <AvatarFallback className="text-sm font-medium">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm truncate">{name}</h3>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
      </div>

        {unreadCount > 0 && (
          <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-5 min-w-[20px] px-1.5">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
    </motion.div>
  )
}
