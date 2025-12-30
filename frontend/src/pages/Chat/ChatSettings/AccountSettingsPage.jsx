import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Globe, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "react-toastify"
import { updateLang, getUserProfileAPI, updateUserProfileAPI } from "../../../api/userApi"

export default function AccountSettingsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const sessionUser = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [language, setLanguage] = useState(sessionStorage.getItem("language") || sessionUser.language || "en");
  const [profileImage, setProfileImage] = useState(sessionUser.profile_image || "");

  const [formData, setFormData] = useState({
    name: sessionUser.full_name || "",
    email: sessionUser.email || "",
    phone: sessionUser.phone || "",
    location: sessionUser.location || "", 
    bio: sessionUser.bio || ""           
  })

  
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await getUserProfileAPI();
        if (response.success) {
          const user = response.data;
          setFormData(prev => ({
            ...prev,
            name: user.full_name || "",
            email: user.email || "",
            phone: user.phone || "",
            location: user.location || "", 
            bio: user.bio || ""           
          }));
          setProfileImage(user.profile_image);

          sessionStorage.setItem("user", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Failed to load profile", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location, 
        bio: formData.bio            
      };

      const response = await updateUserProfileAPI(payload);

      if (response.success) {
        toast.success("Account settings saved!");
        const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
        sessionStorage.setItem("user", JSON.stringify({ ...currentUser, ...response.user }));
      } else {
        toast.error(response.message || "Failed to update settings");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  }

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    try {
      await updateLang(newLang);
      sessionStorage.setItem("language", newLang);
      const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
      currentUser.language = newLang;
      sessionStorage.setItem("user", JSON.stringify(currentUser));

      toast.success("Language updated! Future messages will be translated.");
    } catch (error) {
      console.error("Failed to update language", error);
      toast.error("Failed to update language preference");
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
              <AvatarImage src={profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Current"} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
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
                disabled={loading || saving}
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
                disabled
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
                disabled={loading || saving}
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
                disabled={loading || saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio <span className="text-gray-500 text-xs">(Optional)</span></Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-md bg-background disabled:cursor-not-allowed"
                placeholder="Tell us about yourself"
                disabled={loading || saving}
              />
              
            </div>

            <Button onClick={handleSave} className="w-full" disabled={loading || saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
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
