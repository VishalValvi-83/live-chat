import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MessageCircle, Settings, User, UserPlus, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChatListItem } from "@/components/chat/ChatListItem"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getChatsList } from "../../api/chatApi/chatsApi"
import { getUserProfileAPI, searchUsersAPI } from "../../api/userApi"

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

  const location = useLocation();
  const currentUser = { id: sessionStorage.getItem("user") }

  const isDemo = location.state?.isDemo || currentUser ? false : true;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const [activeChat, setActiveChat] = useState(null)
  const [chatlist, setChatlist] = useState(!isDemo ? [] : mockChats)

  const [profileImage, setProfileImage] = useState("")

  const filteredChats = chatlist?.filter((chat) =>
    chat.user?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const fetchChats = async () => {
    try {
      const response = await getChatsList();
      const chats = response?.data?.data;

      if (!isDemo) {

        const formattedChats = chats?.map(chat => {
          const otherUserId =
            chat.sender_id === currentUser.id
              ? chat.receiver_id
              : chat.sender_id;

          return {
            id: chat.chat_id,
            user: chat.user,
            name: chat.user?.full_name,
            avatar: chat.user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.user?.full_name}`,
            lastMessage: chat.last_message,
            timestamp: new Date(chat.createdAt).toLocaleTimeString(),
            unreadCount: 0,
            isOnline: true
          };
        });
        setChatlist(formattedChats);
      }
      else {
        setChatlist(mockChats);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  }
  useEffect(() => {

    fetchChats();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfileAPI()
        if (response.success) {
          setProfileImage(response.data)
        }
      } catch (error) {
        console.error("Failed to load profile", error)
      }
    }
    fetchProfile()
  }, [])
  const handleChatClick = (chatId, user) => {
    setActiveChat(chatId)
    navigate(`/chats/${chatId}`, { state: { isDemo, chat_id: chatId, user } })
  }

  const handleUserSearch = async (e) => {
    const query = e.target.value;
    setUserSearchQuery(query);

    if (query.length > 2) {
      setIsSearching(true);
      const response = await searchUsersAPI(query);
      if (response.success) {
        setSearchResults(response.data);
      }
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };


  const startNewChat = (user) => {
    navigate(`/chats/${user.id}`, {
      state: {
        user: {
          id: user.id,
          name: user.full_name || user.username,
          avatar: user.profile_image,
          status: "online"
        },
        chat_id: "new"
      }
    });
    setIsSearchOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background relative">
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
              onClick={() => navigate("/settings", { state: { profile: profileImage } })}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar
              className="h-9 w-9 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <AvatarImage src={profileImage.profile_image} />
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
        {filteredChats?.length > 0 ? (
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
                  onClick={() => handleChatClick(chat.id, chat.user)}
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
      <div className="absolute bottom-6 right-6 p-4">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
          onClick={() => setIsSearchOpen(true)}
        >
          <UserPlus className="h-6 w-6" />
        </Button>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-card w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-border"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder="Search by username or phone..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                  value={userSearchQuery}
                  onChange={handleUserSearch}
                />
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="max-h-[300px] overflow-y-auto p-2">
                {isSearching ? (
                  <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <div
                      key={user.id}
                      onClick={() => startNewChat(user)}
                      className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
                    >
                      <Avatar>
                        <AvatarImage src={user.profile_image} />
                        <AvatarFallback>{user.full_name[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground text-sm p-4">
                    {userSearchQuery.length > 0 ? "No users found" : "Type to search..."}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

