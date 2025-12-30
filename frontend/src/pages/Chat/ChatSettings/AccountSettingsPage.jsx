import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "react-toastify"
import { updateLang } from "../../../api/userApi"

export default function AccountSettingsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState( sessionStorage.getItem("language") ||sessionStorage.getItem("user").language || "en");
  const [formData, setFormData] = useState({
    name: "Your Name",
    email: "your.email@example.com",
    phone: "+1 234 567 8900",
    location: "New York, USA",
    bio: "Hey there! I'm using this chat app."
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    toast.success("Account settings saved!")
  }

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setLoading(true);
    try {
      await updateLang(newLang);
      sessionStorage.setItem("language", newLang);
      toast.success("Language updated! Future messages will be translated.");
    } catch (error) {
      console.error("Failed to update language", error);
    } finally {
      setLoading(false);
    }
  };
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
          <h1 className="text-xl font-bold">Account Settings</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg border border-border">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Current" />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Change Photo</Button>
          </div>

          <div className="p-6 bg-card rounded-lg border border-border space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="Tell us about yourself"
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
            <div className="space-y-4 pt-4 border-t border-border">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Language Preferences
              </h2>

              <div className="grid gap-2">
                <Label htmlFor="language">Translate Incoming Messages To:</Label>
                <select
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="en">English (Original)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                  <option value="de">German (Deutsch)</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="zh">Chinese (中文)</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Messages sent to you will be automatically translated to this language.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
