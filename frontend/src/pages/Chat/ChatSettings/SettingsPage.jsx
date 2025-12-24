import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, User, Bell, Lock, Palette, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SettingsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const profile = location.state?.profile || [];

  const settingsItems = [
    { icon: User, label: "Account", description: "Manage your account settings", path: "/settings/account" },
    { icon: Bell, label: "Notifications", description: "Configure notification preferences", path: "/settings/notifications" },
    { icon: Lock, label: "Privacy", description: "Control your privacy settings", path: "/settings/privacy" },
    { icon: Palette, label: "Appearance", description: "Customize your theme", path: "/settings/appearance" },
    { icon: HelpCircle, label: "Help & Support", description: "Get help with the app", path: null },
  ]

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => navigate("/chats")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.profile_image} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{profile.full_name}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/profile")}>
              Edit
            </Button>
          </div>

          <div className="space-y-2">
            {settingsItems.map((item) => (
              <button
                key={item.label}
                onClick={() => item.path ? navigate(item.path) : alert("Coming soon!")}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </button>
            ))}

            <button className="w-full flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:bg-destructive/10 transition-colors text-destructive mt-6">
              <LogOut className="h-5 w-5" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">Sign Out</h3>
                <p className="text-sm text-muted-foreground">Log out of your account</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
