import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, Camera, User, Loader2, Save, MapPin, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" 
import { getUserProfileAPI, updateProfileImageAPI, updateUserProfileAPI } from "../../../api/userApi"
import { toast } from "react-toastify"

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

export default function ProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const location = useLocation()
  const userID = location.state?.user_id;
  const isChatUser = location.state?.isChatUser;
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    profile_image: "",
    location: "", 
    bio: ""       
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let response = null;
        
        if (userID) {
          response = await getUserProfileAPI(userID) 
        } else {
          response = await getUserProfileAPI()
        }

        if (response && response.success) {
          setFormData({
            ...response.data,
            location: response.data.location || "",
            bio: response.data.bio || ""
          })
        }
      } catch (error) {
        console.error("Failed to load profile", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [userID])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max 5MB.")
      return
    }

    setUploadingImg(true)
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", UPLOAD_PRESET)

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      })
      const fileData = await res.json()

      if (fileData.secure_url) {
        const response = await updateProfileImageAPI({ profile_image: fileData.secure_url })

        if (response.success) {
          setFormData((prev) => ({ ...prev, profile_image: fileData.secure_url }))
          toast.success("Profile photo updated!")

          
          if (!isChatUser) {
            const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
            currentUser.profile_image = fileData.secure_url;
            sessionStorage.setItem("user", JSON.stringify(currentUser));
          }
        } else {
          toast.error("Failed to update database")
        }
      }
    } catch (error) {
      console.error("Upload failed", error)
      toast.error("Image upload failed")
    } finally {
      setUploadingImg(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        full_name: formData.full_name,
        phone: formData.phone,
        username: formData.username,
        location: formData.location, 
        bio: formData.bio            
      }

      const response = await updateUserProfileAPI(payload)

      if (response.success) {
        toast.success("Profile updated successfully!")

        
        const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
        sessionStorage.setItem("user", JSON.stringify({ ...currentUser, ...response.user }));

        navigate("/chats")
      } else {
        toast.error(response.message || "Failed to update profile")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
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
          {!isChatUser && (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6 max-w-lg mx-auto pb-10">

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={formData.profile_image} className="object-cover" />
                <AvatarFallback className="text-4xl bg-muted">
                  {formData.full_name?.charAt(0).toUpperCase() || <User className="h-16 w-16" />}
                </AvatarFallback>
              </Avatar>

              {!isChatUser && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-lg cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploadingImg}
                  >
                    {uploadingImg ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Camera className="h-5 w-5" />
                    )}
                  </Button>
                </>
              )}
            </div>
            {!isChatUser && (
              <p className="text-sm text-muted-foreground">
                {uploadingImg ? "Uploading..." : "Click camera to change photo"}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={isChatUser}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isChatUser}
                  placeholder="@username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Bio
              </Label>

              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={isChatUser}
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Tell us a bit about yourself..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={isChatUser}
                placeholder="New York, USA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                disabled={isChatUser}
                placeholder="+1 234 567 890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                disabled
                className="bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
