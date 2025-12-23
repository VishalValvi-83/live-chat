






























































































































































































































import { useState, useEffect, useRef, useCallback } from "react" 
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { io } from "socket.io-client"
import { ChatHeader } from "@/components/chat/ChatHeader"
import { MessageBubble } from "@/components/chat/MessageBubble"
import { MessageInput } from "@/components/chat/MessageInput"
import { TypingIndicator } from "@/components/chat/TypingIndicator" 
import { ScrollArea } from "@/components/ui/scroll-area"
import { getChatConversion, sendMessageAPI } from "../../api/chatApi/chatsApi"


const getCurrentUser = () => {
  const userStr = sessionStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export default function ChatConversationPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const messagesEndRef = useRef(null); 

  
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null); 

  const currentUser = getCurrentUser();
  const otherUserId = location.state?.user.id;
  const chat_id = location.state?.chat_id || id;
  const chatPartner = location.state?.user || null; 

  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(false)

  
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL);

    if (currentUser?.id) {
      socketRef.current.emit("join", currentUser.id);
    }

    socketRef.current.on("receive-message", (newMessage) => {
      if (newMessage.chat_id === chat_id) {
        setMessages((prev) => [...prev, transformSingleMessage(newMessage, currentUser.id)]);
        setIsTyping(false); 
      }
    });


    socketRef.current.on("typing", ({ sender_id }) => {

      if (sender_id === otherUserId) {
        setIsTyping(true);
      }
    });

    socketRef.current.on("stop-typing", ({ sender_id }) => {
      if (sender_id === otherUserId) {
        setIsTyping(false);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [chat_id, currentUser?.id, otherUserId]);


  
  useEffect(() => {
    const fetchHistory = async () => {
      if (!chat_id) return;
      setLoading(true);
      try {
        const response = await getChatConversion(chat_id);
        if (response.success && response.data) {
          const formatted = response.data.map(msg => transformSingleMessage(msg, currentUser.id));
          setMessages(formatted);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [chat_id]);

  
  const transformSingleMessage = (msg, myId) => {
    return {
      id: msg._id,
      content: msg.content,
      timestamp: new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      isSent: msg.sender_id === myId,
      type: msg.message_type === "text" ? undefined : msg.message_type,
      status: msg.read_at ? "read" : "delivered"
    };
  };

  
  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    
    socketRef.current.emit("stop-typing", {
      sender_id: currentUser.id,
      receiver_id: otherUserId
    });

    const tempId = Date.now().toString();
    const tempMessage = {
      id: tempId,
      content,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      isSent: true,
      status: "sent",
    };
    setMessages((prev) => [...prev, tempMessage]);

    const payload = {
      receiver_id: otherUserId,
      content: content,
      message_type: "text"
    };

    const response = await sendMessageAPI(payload);
    if (response && response.success) {
      setMessages((prev) => prev.map(msg =>
        msg.id === tempId ? transformSingleMessage(response.data, currentUser.id) : msg
      ));
    }
  };

  const handleTyping = () => {
    if (socketRef.current && otherUserId && currentUser?.id) {
      socketRef.current.emit("typing", {
        receiver_id: otherUserId,
        sender_id: currentUser.id
      });
    }
  };

  const handleStopTyping = () => {
    if (socketRef.current && otherUserId && currentUser?.id) {
      socketRef.current.emit("stop-typing", {
        receiver_id: otherUserId,
        sender_id: currentUser.id
      });
    }
  };

  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]); 

  if (!chatPartner && !otherUserId) return <div>Invalid Chat</div>;

  return (
    <div className="h-screen flex flex-col bg-background">
      <ChatHeader
        avatar={chatPartner?.avatar}
        name={chatPartner?.full_name || "Chat"}
        status={chatPartner?.status || (isTyping ? "typing..." : "online")}
        isTyping={isTyping} 
        onBack={() => navigate("/chats")}
      />

      <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <p className="text-center text-muted-foreground mt-4">Loading messages...</p>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  {...message}
                  avatar={!message.isSent ? chatPartner?.avatar : undefined}
                />
              ))}

              {/* [NEW] The Rendered Typing Indicator */}
              {isTyping && (
                <div className="mb-4">
                  <TypingIndicator
                    avatar={chatPartner?.avatar}
                    userName={chatPartner?.name}
                  />
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </ScrollArea>

      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}          
        onStopTyping={handleStopTyping}  
      />
    </div>
  )
}
