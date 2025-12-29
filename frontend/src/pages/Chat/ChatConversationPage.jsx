
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
  const otherUserId = location.state?.user?.id;
  const chat_id = location.state?.chat_id || id;
  const chatPartner = location.state?.user || null;

  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(false)
  // const [replyingTo, setReplyingTo] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL);

    if (currentUser?.id) {
      socketRef.current.emit("join", currentUser.id);
    }

    socketRef.current.on("receive-message", (newMessage) => {
      if (newMessage.chat_id === chat_id) {
        setMessages((prev) => [...prev, transformSingleMessage(newMessage, currentUser.id)]);
        setIsTyping(false);

        socketRef.current.emit("message-delivered", {
          message_id: newMessage._id,
          sender_id: newMessage.sender_id
        });

        socketRef.current.emit("message-read", {
          chat_id,
          sender_id: newMessage.sender_id
        });
      }
    });


    socketRef.current.on("message-status-update", ({ message_id, chat_id, status }) => {
      setMessages(prev => prev.map(msg => {

        if (message_id && msg.id === message_id) {
          return { ...msg, status };
        }

        if (chat_id && msg.isSent && status === "read") {
          return { ...msg, status: "read" };
        }
        return msg;
      }));
    });


    socketRef.current.on("typing", ({ sender_id }) => {
      if (sender_id === otherUserId) setIsTyping(true);
    });
    socketRef.current.on("stop-typing", ({ sender_id }) => {
      if (sender_id === otherUserId) setIsTyping(false);
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


          if (socketRef.current && otherUserId) {
            socketRef.current.emit("message-read", {
              chat_id,
              sender_id: otherUserId
            });
          }
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
      status: msg.read_at ? "read" : (msg.delivered_at ? "delivered" : "sent"),
      reply_to: msg.reply_to ? {
        id: msg.reply_to.id,
        content: msg.reply_to.content,
        type: msg.reply_to.type
      } : null

    };
  };

  // const handleSendMessage = async (content, type = "text") => {
  //   if (!content) return;


  //   socketRef.current.emit("stop-typing", {
  //     sender_id: currentUser.id,
  //     receiver_id: otherUserId
  //   });

  //   const tempId = Date.now().toString();
  //   const tempMessage = {
  //     id: tempId,
  //     content,
  //     timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  //     isSent: true,
  //     status: "sent",
  //     type: type,
  //     reply_to: payload.reply_to // Show reply immediately in UI
  //   };
  //   setMessages((prev) => [...prev, tempMessage]);
  //   setReplyingTo(null);
  //   const payload = {
  //     receiver_id: otherUserId,
  //     content: content,
  //     message_type: type,
  //     reply_to: replyingTo ? {
  //       id: replyingTo.id,
  //       content: replyingTo.content,
  //       type: replyingTo.type
  //     } : null
  //   };

  //   const response = await sendMessageAPI(payload);
  //   if (response && response.success) {
  //     setMessages((prev) => prev.map(msg =>
  //       msg.id === tempId ? transformSingleMessage(response.data, currentUser.id) : msg
  //     ));

  //   }

  // };

  const handleSendMessage = async (content, type = "text") => {
    if (!content && type === "text") return;

    // Payload now includes reply_to
    const payload = {
      receiver_id: otherUserId,
      content: content,
      message_type: type,
      reply_to: replyingTo ? {
        id: replyingTo.id,
        content: replyingTo.content,
        type: replyingTo.type,
        sender_id: replyingTo.sender_id // To show "Replying to Ben"
      } : null
    };

    // Optimistic UI Update (Temp Message)
    const tempId = Date.now().toString();
    const tempMessage = {
      id: tempId,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      status: "sent",
      type: type,
      reply_to: payload.reply_to // Show reply immediately in UI
    };

    setMessages((prev) => [...prev, tempMessage]);

    // Clear reply state immediately
    setReplyingTo(null);

    // API Call
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
  const handleScrollToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      element.classList.add("bg-accent/50");
      setTimeout(() => {
        element.classList.remove("bg-accent/50");
      }, 1000);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <ChatHeader
        avatar={chatPartner?.profile_image}
        name={chatPartner?.full_name || "Chat"}
        status={chatPartner?.status || (isTyping ? "typing..." : "online")}
        isTyping={isTyping}
        onBack={() => navigate("/chats")}
        profileId={otherUserId}
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
                  avatar={!message.isSent ? chatPartner?.profile_image : undefined}
                  onReply={() => setReplyingTo({
                    id: message.id,
                    content: message.content,
                    type: message.type || "text",
                    sender_id: message.isSent ? currentUser.id : otherUserId,
                    senderName: message.isSent ? "You" : chatPartner?.full_name
                  })}
                  onReplyClick={handleScrollToMessage}
                />
              ))}


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
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />
    </div>
  )
}
