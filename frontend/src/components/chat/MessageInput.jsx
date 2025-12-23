import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Smile, Paperclip, Mic, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function MessageInput({
  onSendMessage,
  onTyping,      
  onStopTyping,  
  placeholder = "Type a message...",
}) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState(null)

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage?.(message)
      setMessage("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    
    if (onTyping) onTyping();

    
    if (typingTimeout) clearTimeout(typingTimeout);

    
    const newTimeout = setTimeout(() => {
      if (onStopTyping) onStopTyping();
    }, 2000);

    setTypingTimeout(newTimeout);
  };

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm px-4 py-3 sticky bottom-0">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-muted/50 rounded-3xl px-4 py-2 border border-border/50">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 shrink-0"
          >
            <Smile className="h-5 w-5 text-muted-foreground" />
          </Button>

          <Textarea
            value={message}
            onChange={handleChange} 
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="..." 
            rows={1}
          />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 shrink-0"
          >
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {message.trim() ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Button
              size="icon"
              className="rounded-full h-11 w-11 mt-1 bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
              onClick={handleSend}
            >
              <Send className="h-5 w-5" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Button
              size="icon"
              variant={isRecording ? "destructive" : "secondary"}
              className="rounded-full h-11 w-11 mt-1 shadow-lg"
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
