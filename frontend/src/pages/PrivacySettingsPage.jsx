import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Eye, Shield, Lock, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacySettingsPage() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    lastSeen: "everyone",
    profilePhoto: "everyone",
    about: "everyone",
    readReceipts: true,
    blockedContacts: 0
  })

  const privacyOptions = [
    {
      icon: Eye,
      label: "Last Seen",
      description: "Who can see when you were last online",
      key: "lastSeen",
      type: "select",
      options: ["everyone", "contacts", "nobody"]
    },
    {
      icon: UserCheck,
      label: "Profile Photo",
      description: "Who can see your profile photo",
      key: "profilePhoto",
      type: "select",
      options: ["everyone", "contacts", "nobody"]
    },
    {
      icon: Shield,
      label: "About",
      description: "Who can see your about info",
      key: "about",
      type: "select",
      options: ["everyone", "contacts", "nobody"]
    },
    {
      icon: Eye,
      label: "Read Receipts",
      description: "Send and receive read receipts",
      key: "readReceipts",
      type: "toggle"
    }
  ]

  const handleSelectChange = (key, value) => {
    setSettings({ ...settings, [key]: value })
  }

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

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
          <h1 className="text-xl font-bold">Privacy Settings</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-2">
          {privacyOptions.map((option) => (
            <div
              key={option.key}
              className="p-4 bg-card rounded-lg border border-border"
            >
              <div className="flex items-start gap-4">
                <option.icon className="h-5 w-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{option.label}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                  
                  {option.type === "select" && (
                    <select
                      value={settings[option.key]}
                      onChange={(e) => handleSelectChange(option.key, e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
                    >
                      {option.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {option.type === "toggle" && (
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
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            className="w-full flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:bg-accent transition-colors"
            onClick={() => alert("Blocked contacts feature coming soon!")}
          >
            <Lock className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 text-left">
              <h3 className="font-medium">Blocked Contacts</h3>
              <p className="text-sm text-muted-foreground">
                {settings.blockedContacts} contact{settings.blockedContacts !== 1 ? "s" : ""} blocked
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
