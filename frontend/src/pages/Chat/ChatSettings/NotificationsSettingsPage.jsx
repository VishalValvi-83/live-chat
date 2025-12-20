import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, MessageCircle, Phone, Users, Volume2, Vibrate } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotificationsSettingsPage() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    messages: true,
    calls: true,
    groups: true,
    sound: true,
    vibrate: true,
    preview: true,
  })

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  const notificationOptions = [
    { key: "messages", icon: MessageCircle, label: "Message Notifications", description: "Get notified about new messages" },
    { key: "calls", icon: Phone, label: "Call Notifications", description: "Get notified about incoming calls" },
    { key: "groups", icon: Users, label: "Group Notifications", description: "Get notified about group messages" },
    { key: "sound", icon: Volume2, label: "Sound", description: "Play sound for notifications" },
    { key: "vibrate", icon: Vibrate, label: "Vibrate", description: "Vibrate on notifications" },
    { key: "preview", icon: MessageCircle, label: "Message Preview", description: "Show message preview in notifications" },
  ]

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => navigate("/settings")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Notification Settings</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-2">
          {notificationOptions.map((option) => (
            <div
              key={option.key}
              className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
            >
              <div className="flex items-center gap-4">
                <option.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">{option.label}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(option.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[option.key] ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[option.key] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
