import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, MessageCircle, Settings, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChatListItem } from "@/components/chat/ChatListItem"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mockChats = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    lastMessage: "Wow! That looks amazing 🌴",
    timestamp: "10:38 AM",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    lastMessage: "Voice message",
    timestamp: "9:22 AM",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "3",
    name: "Emily Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    lastMessage: "See you tomorrow!",
    timestamp: "Yesterday",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "4",
    name: "Alex Turner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    lastMessage: "Thanks for the update",
    timestamp: "Yesterday",
    unreadCount: 5,
    isOnline: true,
  },
  {
    id: "5",
    name: "Jessica Martinez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    lastMessage: "Let's catch up soon!",
    timestamp: "2 days ago",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "6",
    name: "Tom Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
    lastMessage: "Perfect, I'll be there",
    timestamp: "2 days ago",
    unreadCount: 1,
    isOnline: false,
  },
  {
    id: "7",
    name: "Rachel Green",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
    lastMessage: "Did you get my email?",
    timestamp: "3 days ago",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "8",
    name: "David Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    lastMessage: "Great meeting today!",
    timestamp: "1 week ago",
    unreadCount: 0,
    isOnline: false,
  },
]

export default function ChatsListPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeChat, setActiveChat] = useState(null)

  const filteredChats = mockChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleChatClick = (chatId) => {
    setActiveChat(chatId)
    navigate(`/chats/${chatId}`)
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold">Chats</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar
              className="h-9 w-9 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Current" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ChatListItem
                  {...chat}
                  isActive={activeChat === chat.id}
                  onClick={() => handleChatClick(chat.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <MessageCircle className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No conversations found</h2>
            <p className="text-muted-foreground">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
