// import { motion } from "framer-motion"
// import { Check, CheckCheck, Image as ImageIcon, FileText, Mic, CornerUpLeft, Clock } from "lucide-react"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { cn } from "@/lib/utils"
// import CustomAudioPlayer from "./CustomAudioPlayer"
// import { Button } from "@/components/ui/button"

// export function MessageBubble({
//   id,
//   content,
//   timestamp,
//   isSent,
//   type = "text",
//   status = "read",
//   avatar,
//   userName,
//   reply_to,
//   onReply,
//   onReplyClick,
//   translation }) {
//   const bubbleVariants = {
//     hidden: { opacity: 0, y: 20, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: { duration: 0.3, ease: "easeOut" },
//     },
//   }

//   const renderMessageContent = () => {
//     switch (type) {
//       case "image":
//         return (
//           <div className="space-y-2">
//             <div className="relative h-48 w-64 overflow-hidden rounded-lg bg-muted">
//               <div className="flex h-full items-center justify-center">
//                 <ImageIcon className="h-12 w-12 text-muted-foreground" />
//               </div>
//             </div>
//             {content && <p className="text-sm">{content}</p>}
//           </div>
//         )
//       case "audio":
//         return (

//           <CustomAudioPlayer content={content} />
//           // <div className="flex items-center gap-3 min-w-[280px]">
//           //   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/50">
//           //     <Mic className="h-5 w-5" />
//           //   </div>
//           //   <audio
//           //     controls
//           //     src={content}
//           //     className="w-full h-8 "
//           //     onPlay={(e) => e.currentTarget.play()}

//           //   // Custom styling for audio element can be tricky, 
//           //   // but this ensures it works on all browsers.
//           //   />
//           // </div>
//         )
//       case "file":
//         return (
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/50">
//               <FileText className="h-5 w-5" />
//             </div>
//             <div>
//               <p className="text-sm font-medium">{content}</p>
//               <p className="text-xs opacity-70">2.4 MB</p>
//             </div>
//           </div>
//         )
//       default:
//         return <p className="whitespace-pre-wrap break-words text-sm">{content}</p>
//     }
//   }

//   return (
//     <motion.div
//       id={`message-${id}`}
//       variants={bubbleVariants}
//       initial="hidden"
//       onDoubleClick={onReply}
//       // Add a gesture or button here to trigger "onSwipeToReply(props)"
//       animate="visible"
//       className={cn(
//         "flex gap-2 mb-3 group",
//         isSent ? "flex-row-reverse" : "flex-row"
//       )}
//     >
//       {!isSent && (
//         <Avatar className="h-8 w-8">
//           <AvatarImage src={avatar} />
//           <AvatarFallback className="text-xs">
//             {userName?.charAt(0).toUpperCase() || "U"}
//           </AvatarFallback>
//         </Avatar>
//       )}

//       <div
//         className={cn(
//           "max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm",
//           isSent
//             ? "bg-gradient-to-br from-primary to- text-white rounded-br-md"
//             : "bg-primary-foreground text-card-foreground rounded-bl-md border border-border/50"
//         )}
//       >
//         {reply_to && (
//           <div onClick={() => onReplyClick?.(reply_to.id)}
//             className={cn(
//               "mb-2 rounded px-3 py-1.5 text-xs border-l-4 bg-black/10 cursor-pointer opacity-90 hover:opacity-100 transition-opacity",
//               isSent ? "border-white/50" : "border-primary"
//             )}>
//             <p className="font-bold opacity-80 mb-0.5">Reply to message</p>
//             <p className="line-clamp-1 opacity-70">
//               {reply_to.type === 'image' ? '📷 Photo' : reply_to.content}
//             </p>
//           </div>
//         )}
//         {renderMessageContent()}

//         {!isSent && translation && translation.lang != 'en' && (
//           <div className={`mt-2 pt-2 border-t ${isSent ? "border-white/20" : "border-black/10"}`}>
//             <p className="text-[10px] uppercase tracking-wider opacity-70 mb-0.5 flex items-center gap-1">
//               Translated ({translation.lang})
//             </p>
//             <p className="text-sm italic opacity-95">
//               {translation.text}
//             </p>
//           </div>
//         )}
//         <div className={cn(
//           "flex items-center justify-end gap-1 mt-1.5",
//           isSent ? "text-white/70" : "text-muted-foreground"
//         )}>
//           <span className="text-xs text-secondary-foreground">{timestamp}</span>
//           {isSent && (
//             <span>
//               {status === "scheduled" && <Clock className="h-3.5 w-3.5 text-primary" />}
//               {status === "sent" && <Check className="h-3.5 w-3.5" />}
//               {status === "delivered" && <CheckCheck className="h-3.5 w-3.5" />}
//               {status === "read" && <CheckCheck className="h-3.5 w-3.5 text-blue-800" />}
//             </span>
//           )}
//         </div>

//       </div>
//       <Button
//         variant="ghost"
//         size="icon"
//         className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
//         onClick={onReply}
//         title="Reply"
//       >
//         <CornerUpLeft className="h-4 w-4 text-muted-foreground" />
//       </Button>

//     </motion.div >
//   )
// }


import { motion } from "framer-motion"
import { Check, CheckCheck, Image as ImageIcon, FileText, Mic, CornerUpLeft, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import CustomAudioPlayer from "./CustomAudioPlayer"
import { Button } from "@/components/ui/button"

export function MessageBubble({
  id,
  content,
  timestamp,
  isSent,
  type = "text",
  status = "read",
  avatar,
  userName,
  reply_to,
  onReply,
  onReplyClick,
  onImageClick,
  translation }) {

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
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={content}
                alt="Sent image"
                className="max-w-full sm:max-w-sm max-h-80 rounded-lg object-cover hover:scale-[1.01] transition-transform cursor-pointer"
                onClick={() => onImageClick?.(content)}
                loading="lazy"
              />
            </div>
          </div>
        )
      case "audio":
        return (
          <CustomAudioPlayer content={content} />
        )
      case "file":
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/50">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium break-all">{content.split('/').pop()}</p> {/* Show filename if possible */}
              <p className="text-xs opacity-70">Attachment</p>
            </div>
          </div>
        )
      default:
        return <p className="whitespace-pre-wrap break-words text-sm">{content}</p>
    }
  }

  return (
    <motion.div
      id={`message-${id}`}
      variants={bubbleVariants}
      initial="hidden"
      onDoubleClick={onReply}
      animate="visible"
      className={cn(
        "flex gap-2 mb-3 group",
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
        {reply_to && (
          <div onClick={() => onReplyClick?.(reply_to.id)}
            className={cn(
              "mb-2 rounded px-3 py-1.5 text-xs border-l-4 bg-black/10 cursor-pointer opacity-90 hover:opacity-100 transition-opacity",
              isSent ? "border-white/50" : "border-primary"
            )}>
            <p className="font-bold opacity-80 mb-0.5">Reply to message</p>
            <p className="line-clamp-1 opacity-70">
              {reply_to.type === 'image' ? '📷 Photo' : reply_to.content}
            </p>
          </div>
        )}

        {renderMessageContent()}

        {!isSent && translation && translation.lang != 'en' && (
          <div className={`mt-2 pt-2 border-t ${isSent ? "border-white/20" : "border-black/10"}`}>
            <p className="text-[10px] uppercase tracking-wider opacity-70 mb-0.5 flex items-center gap-1">
              Translated ({translation.lang})
            </p>
            <p className="text-sm italic opacity-95">
              {translation.text}
            </p>
          </div>
        )}

        <div className={cn(
          "flex items-center justify-end gap-1 mt-1.5",
          isSent ? "text-white/70" : "text-muted-foreground"
        )}>
          <span className="text-xs text-secondary-foreground">{timestamp}</span>
          {isSent && (
            <span>
              {status === "scheduled" && <Clock className="h-3.5 w-3.5 text-white/80" />}
              {status === "sent" && <Check className="h-3.5 w-3.5" />}
              {status === "delivered" && <CheckCheck className="h-3.5 w-3.5" />}
              {status === "read" && <CheckCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-200" />}
            </span>
          )}
        </div>

      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
        onClick={onReply}
        title="Reply"
      >
        <CornerUpLeft className="h-4 w-4 text-muted-foreground" />
      </Button>

    </motion.div >
  )
}