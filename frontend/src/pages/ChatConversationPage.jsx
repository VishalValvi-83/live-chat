import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChatHeader } from "@/components/chat/ChatHeader"
import { MessageBubble } from "@/components/chat/MessageBubble"
import { MessageInput } from "@/components/chat/MessageInput"
import { TypingIndicator } from "@/components/chat/TypingIndicator"
import { ScrollArea } from "@/components/ui/scroll-area"

const mockUsers = {
  "1": {
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    status: "online",
  },
  "2": {
    name: "Mike Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    status: "online",
  },
  "3": {
    name: "Emily Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    status: "last seen 30m ago",
  },
  "4": {
    name: "Alex Turner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    status: "online",
  },
  "5": {
    name: "Jessica Martinez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    status: "last seen 1h ago",
  },
  "6": {
    name: "Tom Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
    status: "last seen 2h ago",
  },
  "7": {
    name: "Rachel Green",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
    status: "online",
  },
  "8": {
    name: "David Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    status: "last seen yesterday",
  },
}

const mockMessages = {
  "1": [
    {
      id: "1",
      content: "Hey! How are you doing?",
      timestamp: "10:30 AM",
      isSent: false,
      status: "read",
    },
    {
      id: "2",
      content: "I'm doing great! Thanks for asking 😊",
      timestamp: "10:32 AM",
      isSent: true,
      status: "read",
    },
    {
      id: "3",
      content: "That's awesome! What have you been up to lately?",
      timestamp: "10:33 AM",
      isSent: false,
      status: "read",
    },
    {
      id: "4",
      content: "Working on some exciting projects. I'll tell you more about it when we meet!",
      timestamp: "10:35 AM",
      isSent: true,
      status: "read",
    },
    {
      id: "5",
      content: "vacation_photo.jpg",
      timestamp: "10:36 AM",
      isSent: false,
      type: "image",
      status: "read",
    },
    {
      id: "6",
      content: "Wow! That looks amazing 🌴",
      timestamp: "10:38 AM",
      isSent: true,
      status: "delivered",
    },
  ],
  "2": [
    {
      id: "1",
      content: "Thanks for the help yesterday!",
      timestamp: "9:15 AM",
      isSent: false,
      status: "read",
    },
    {
      id: "2",
      content: "No problem! Happy to help anytime",
      timestamp: "9:20 AM",
      isSent: true,
      status: "read",
    },
    {
      id: "3",
      content: "Voice message",
      timestamp: "9:22 AM",
      isSent: false,
      type: "audio",
      status: "read",
    },
  ],
}

export default function ChatConversationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const scrollRef = useRef(null)

  const [messages, setMessages] = useState(mockMessages[id] || [])
  const [isTyping, setIsTyping] = useState(false)
  const user = mockUsers[id]

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (content) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      isSent: true,
      status: "sent",
    }

    setMessages([...messages, newMessage])

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        )
      )
    }, 1000)

    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const replyMessage = {
          id: (Date.now() + 1).toString(),
          content: "Thanks for your message! This is a demo response.",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
          isSent: false,
        }
        setMessages((prev) => [...prev, replyMessage])
      }, 2000)
    }, 1500)
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Chat not found</h2>
          <p className="text-muted-foreground">This conversation doesn't exist</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <ChatHeader
        avatar={user.avatar}
        name={user.name}
        status={user.status}
        isTyping={isTyping}
        onBack={() => navigate("/chats")}
      />

      <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
              isSent={message.isSent}
              type={message.type}
              status={message.status}
              avatar={!message.isSent ? user.avatar : undefined}
              userName={!message.isSent ? user.name : undefined}
            />
          ))}

          {isTyping && <TypingIndicator avatar={user.avatar} userName={user.name} />}
        </div>
      </ScrollArea>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  )
}
