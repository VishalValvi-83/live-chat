import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Camera, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
  const navigate = useNavigate()
  const [name, setName] = useState("Your Name")
  const [email, setEmail] = useState("your.email@example.com")
  const [bio, setBio] = useState("Hey there! I'm using this chat app.")

  const handleSave = () => {
    console.log("Saving profile...")
    navigate("/chats")
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate("/chats")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Current" />
                <AvatarFallback>
                  <User className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-10 w-10"
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Click to change photo</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
