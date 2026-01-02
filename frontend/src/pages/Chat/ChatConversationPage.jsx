
import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { io } from "socket.io-client"
import { ChatHeader } from "@/components/chat/ChatHeader"
import { MessageBubble } from "@/components/chat/MessageBubble"
import { MessageInput } from "@/components/chat/MessageInput"
import { TypingIndicator } from "@/components/chat/TypingIndicator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getChatConversion, sendMessageAPI } from "../../api/chatApi/chatsApi"
import { getUserProfileAPI } from "../../api/userApi"
import { ImagePreviewModal } from "@/components/ui/ImagePreviewModal";

const getCurrentUser = () => {
  const userStr = sessionStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export default function ChatConversationPage() {
  const prevLastMessageId = useRef(null);
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const prevMessagesLength = useRef(0);
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
  const [replyingTo, setReplyingTo] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [partnerStatus, setPartnerStatus] = useState("offline");
  const [lastSeen, setLastSeen] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);
  useEffect(() => {
    prevMessagesLength.current = 0;
  }, [chat_id]);


  useEffect(() => {
    if (otherUserId) {
      getUserProfileAPI(otherUserId).then(res => {
        if (res.success && res.data) {
          setPartnerStatus(res.data.is_online ? "online" : "offline");
          setLastSeen(res.data.last_seen);
        }
      });
    }
  }, [otherUserId]);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token }
    });

    socketRef.current.on("receive-message", (newMessage) => {
      if (newMessage.chat_id === chat_id) {
        setMessages((prev) => {
          if (prev.some(msg => msg.id === newMessage._id)) {
            return prev;
          }
          return [...prev, transformSingleMessage(newMessage, currentUser.id)];
        });
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

    socketRef.current.on("message-sent-confirmed", ({ id, status }) => {
      setMessages(prev => prev.map(msg =>
        msg.id === id ? { ...msg, status: status } : msg
      ));
    });

    socketRef.current.on("message-status-update", ({ message_id, chat_id, status }) => {
      setMessages(prev => prev.map(msg => {

        // Helper: Logic to prevent downgrading status
        const shouldUpdate = (currentStatus, newStatus) => {
          if (currentStatus === "read") return false; // If Read, stay Read.
          if (currentStatus === "delivered" && newStatus === "sent") return false;
          return true;
        };

        // Case 1: Specific Message Update (e.g. Delivered)
        if (message_id && msg.id === message_id) {
          // Only update if it's an "upgrade" (e.g., sent -> delivered)
          if (!shouldUpdate(msg.status, status)) return msg;
          return { ...msg, status };
        }

        // Case 2: Bulk Read Update (e.g. User opened chat)
        if (chat_id && msg.isSent && status === "read") {
          return { ...msg, status: "read" };
        }

        return msg;
      }));
    });

    socketRef.current.on("user-online", ({ userId }) => {
      if (userId === otherUserId) {
        setPartnerStatus("online");
      }
    });

    socketRef.current.on("user-offline", ({ userId }) => {
      if (userId === otherUserId) {
        setPartnerStatus("offline");
        setLastSeen(new Date().toISOString());
      }
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
    const loadInitialMessages = async () => {
      if (!chat_id) return;

      setLoading(true);
      try {
        setPage(1);

        const response = await getChatConversion(chat_id, 1);

        if (response.success && response.data) {
          const formatted = response.data.map(msg => transformSingleMessage(msg, currentUser.id));
          setMessages(formatted);
          setHasMore(response.hasMore);


          if (socketRef.current && otherUserId) {
            socketRef.current.emit("message-read", { chat_id, sender_id: otherUserId });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialMessages();
  }, [chat_id]);

  const loadMoreMessages = async () => {
    if (!hasMore || isFetchingMore) return;

    setIsFetchingMore(true);
    const nextPage = page + 1;

    const scrollContainer = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    const oldHeight = scrollContainer?.scrollHeight;
    const oldTop = scrollContainer?.scrollTop;

    try {
      const response = await getChatConversion(chat_id, nextPage);

      if (response.success && response.data.length > 0) {
        const newMessages = response.data.map(msg => transformSingleMessage(msg, currentUser.id));

        setMessages(prev => {

          const existingIds = new Set(prev.map(m => m.id));


          const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.id));

          return [...uniqueNewMessages, ...prev];
        });

        setPage(nextPage);
        setHasMore(response.hasMore);


        setTimeout(() => {
          if (scrollContainer) {
            const newHeight = scrollContainer.scrollHeight;
            scrollContainer.scrollTop = newHeight - oldHeight + oldTop;
          }
        }, 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more", error);
    } finally {
      setIsFetchingMore(false);
    }
  };


  const handleScroll = (e) => {
    const { scrollTop } = e.currentTarget;

    if (scrollTop === 0 && hasMore && !loading && !isFetchingMore) {
      loadMoreMessages();
    }
  };


  const transformSingleMessage = (msg, myId) => {
    return {
      id: msg._id,
      content: msg.content,
      timestamp: new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      isSent: msg.sender_id === myId,
      type: msg.message_type === "text" ? undefined : msg.message_type,

      status: msg.status === "scheduled"
        ? "scheduled"
        : (msg.read_at ? "read" : (msg.delivered_at ? "delivered" : "sent")),

      reply_to: msg.reply_to ? {
        id: msg.reply_to.id,
        content: msg.reply_to.content,
        type: msg.reply_to.type
      } : null,
      translation: msg.translation || null
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

  const handleSendMessage = async (content, type = "text", scheduledFor = null) => {
    if (!content && type === "text") return;


    const payload = {
      receiver_id: otherUserId,
      content: content,
      message_type: type,
      scheduled_for: scheduledFor || null,
      reply_to: replyingTo ? {
        id: replyingTo.id,
        content: replyingTo.content,
        type: replyingTo.type,
        sender_id: replyingTo.sender_id
      } : null

    };

    const tempId = Date.now().toString();
    const tempMessage = {
      id: tempId,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      status: scheduledFor ? "scheduled" : "sent",
      type: type,
      reply_to: payload.reply_to
    };

    setMessages((prev) => [...prev, tempMessage]);


    setReplyingTo(null);


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


  // useEffect(() => {

  //   const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');

  //   if (!viewport || isFetchingMore) return;

  //   const currentLength = messages.length;
  //   const prevLength = prevMessagesLength.current;

  //   if (prevLength === 0 && currentLength > 0) {
  //     setTimeout(() => {
  //       viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'auto' });
  //     }, 100);
  //   }

  //   else if (currentLength > prevLength) {
  //     const lastMessage = messages[messages.length - 1];
  //     const isMyMessage = lastMessage?.isSent;

  //     const distanceFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
  //     const isNearBottom = distanceFromBottom < 200;

  //     if (isMyMessage || isNearBottom) {
  //       setTimeout(() => {
  //         viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
  //       }, 100);
  //     }
  //   }

  //   prevMessagesLength.current = currentLength;

  // }, [messages, isFetchingMore]);


  useEffect(() => {
    const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!viewport || isFetchingMore) return;

    const currentLength = messages.length;
    const prevLength = prevMessagesLength.current;
    const lastMessage = messages[messages.length - 1];

    if (prevLength === 0 && currentLength > 0) {
      setTimeout(() => {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'auto' });
      }, 100);
    }

    else if (currentLength > prevLength) {

      const isNewMessageAtBottom = lastMessage?.id !== prevLastMessageId.current;

      if (isNewMessageAtBottom) {
        const isMyMessage = lastMessage?.isSent;
        const distanceFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
        const isNearBottom = distanceFromBottom < 200;

        if (isMyMessage || isNearBottom) {
          setTimeout(() => {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
          }, 100);
        }
      }
    }

    prevMessagesLength.current = currentLength;
    prevLastMessageId.current = lastMessage?.id;

  }, [messages, isFetchingMore]);

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
        // status={chatPartner?.status || (isTyping ? "typing..." : "online")}
        isTyping={isTyping}
        status={partnerStatus}
        lastSeen={lastSeen}
        onBack={() => navigate("/chats")}
        profileId={otherUserId}
      />

      <ScrollArea
        className="flex-1 px-4 py-6"
        onScrollCapture={handleScroll}
        ref={scrollRef}>
        <div className="max-w-4xl mx-auto">
          {isFetchingMore && (
            <div className="flex justify-center py-2 mb-2">
              <span className="text-xs text-muted-foreground animate-pulse">Loading history...</span>
            </div>
          )}
          {loading ? (
            <p className="text-center text-muted-foreground mt-4">Loading messages...</p>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  {...message}
                  avatar={!message.isSent ? chatPartner?.profile_image : undefined}
                  onImageClick={(src) => setPreviewImage(src)}
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
      <ImagePreviewModal
        src={previewImage}
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  )
}
