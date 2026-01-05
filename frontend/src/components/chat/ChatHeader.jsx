import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { useCall } from "../../context/CallContext"
import { toast } from "react-toastify"

const formatLastSeen = (dateString) => {
  if (!dateString) return "Offline";
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();


  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return isToday ? `Last seen today at ${time}` : `Last seen on ${date.toLocaleDateString()} at ${time}`;
}

export function ChatHeader({
  avatar,
  name,
  status = "offline",
  lastSeen,
  isTyping = false,
  onBack,
  isGroup,
  profileId,
  onGroupInfoClick
}) {
  const { callUser } = useCall();

  const handleCall = (video = false) => {
    if (isGroup) return toast.success("Group calling is coming soon!");
    if (!profileId) return;

    callUser(profileId, video);
  };
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <Button variant="ghost" size="icon" className="rounded-full" onClick={onBack}>
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/*  Make this section Clickable for Groups */}
      <div
        className={`flex items-center gap-3 flex-1 min-w-0 ${isGroup ? 'cursor-pointer hover:opacity-80' : ''}`}
        onClick={() => isGroup && onGroupInfoClick && onGroupInfoClick()}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} />
          <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-sm truncate">{name}</h2>
          <p className="text-xs text-muted-foreground">
            {isTyping ? (
              <span className="text-blue-500 font-medium">typing...</span>
            ) : (
              status === "online"
                ? <span className="text-green-500 font-medium">Online</span>
                : (isGroup ? <span className="text-muted-foreground font-medium">Tap for group info</span> : formatLastSeen(lastSeen))
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleCall(false)}>
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => handleCall(true)}>
          <Video className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isGroup ? (
              <DropdownMenuItem onClick={onGroupInfoClick}>Group Info</DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => navigate("/profile", { state: { user_id: profileId, isChatUser: true } })}>
                View Profile
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>Search Messages</DropdownMenuItem>
            {/* ... */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
