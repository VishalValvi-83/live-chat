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
}) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={onBack}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar} />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-sm truncate">{name}</h2>
        <p className="text-xs text-muted-foreground">
          {isTyping ? (
            <span className="text-blue-500 font-medium">typing...</span>
          ) : (
            status === "online"
              ? <span className="text-green-500 font-medium">Online</span>
              : (isGroup ? <span className="text-gray-500 font-medium">Group Chat</span> : formatLastSeen(lastSeen))
          )}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Video className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/profile", { state: { user_id: profileId, isChatUser: true } })} >View Profile</DropdownMenuItem>
            <DropdownMenuItem>Search Messages</DropdownMenuItem>
            <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Block User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
