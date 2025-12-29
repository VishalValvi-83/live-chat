import { useState, useRef } from "react"
import { Send, Smile, Paperclip, Mic, Square, Trash2, Loader2, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, CornerUpLeft } from "lucide-react";

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_VOICE_PRESET;


export function MessageInput({ onSendMessage, onTyping, onStopTyping, replyingTo, onCancelReply }) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [scheduleTime, setScheduleTime] = useState(""); // Store date string
  const dateInputRef = useRef(null);
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)

  // 1. Handle Text Submit
  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message, "text", scheduleTime || null);
      setMessage("")
      onStopTyping?.()
      setScheduleTime("");
    }
  }

  // 2. Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = handleUploadAudio

      mediaRecorderRef.current.start()
      setIsRecording(true)

      // Start Timer
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error("Microphone access denied:", error)
      alert("Could not access microphone.")
    }
  }

  // 3. Stop Recording & Upload
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      clearInterval(timerRef.current)

      // Stop all audio tracks to release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  // 4. Cancel Recording
  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      clearInterval(timerRef.current)
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      // Clear data handler to prevent upload
      mediaRecorderRef.current.onstop = null
      audioChunksRef.current = []
    }
  }

  // 5. Upload to Cloudinary
  const handleUploadAudio = async () => {
    if (audioChunksRef.current.length === 0) return

    setIsUploading(true)
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })

    const formData = new FormData()
    formData.append("file", audioBlob)
    formData.append("upload_preset", UPLOAD_PRESET)

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
        method: "POST",
        body: formData
      })

      const data = await res.json()

      if (data.secure_url) {
        onSendMessage(data.secure_url, "audio") // Send as "audio"
      }
    } catch (error) {
      console.error("Audio upload failed:", error)
      alert("Failed to send audio message")
    } finally {
      setIsUploading(false)
    }
  }

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col">
      {/* 👇 1. Reply Preview Section */}
      {replyingTo && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-t border-border border-l-4 border-l-primary mx-4 mt-2 rounded-r-lg">
          <div className="flex flex-col text-sm">
            <span className="text-primary font-bold flex items-center gap-1">
              <CornerUpLeft className="h-3 w-3" /> Replying to {replyingTo.senderName}
            </span>
            <span className="text-muted-foreground line-clamp-1 opacity-90">
              {replyingTo.type === "image" ? "📷 Photo" :
                replyingTo.type === "audio" ? "🎤 Voice Message" :
                  replyingTo.content}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancelReply} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="p-4 bg-background border-t border-border">
        {isRecording || isUploading ? (

          <div className="flex items-center gap-4 animate-in fade-in duration-200">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border">
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-red-500">
                {isUploading ? "Sending..." : `Recording ${formatTime(recordingTime)}`}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={cancelRecording}
              disabled={isUploading}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              onClick={stopRecording}
              disabled={isUploading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-10 w-10 shadow-sm"
            >
              {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        ) : (

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors">
              <Paperclip className="h-5 w-5" />
            </Button>

            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  onTyping?.()
                }}
                onBlur={() => onStopTyping?.()}
                placeholder="Type a message..."
                className="pr-10 rounded-full bg-muted/50 border-border focus-visible:ring-1 focus-visible:ring-primary/20"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </div>

            {message.trim() ? (
              <Button type="submit" size="icon" className="rounded-full bg-primary hover:bg-primary/90 shadow-sm transition-all duration-200">
                <Send className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="icon"
                onClick={startRecording}
                className="rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-sm transition-all duration-200"
              >
                <Mic className="h-5 w-5" />
              </Button>
            )}

            <input
              type="datetime-local"
              ref={dateInputRef}
              className="hidden"
              onChange={(e) => setScheduleTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)} // Prevent past dates
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={scheduleTime ? "text-blue-500 bg-blue-50" : "text-muted-foreground"}
              onClick={() => dateInputRef.current?.showPicker()} // Opens native picker
            >
              <Clock className="h-5 w-5" />
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}