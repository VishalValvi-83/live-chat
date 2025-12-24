import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Camera, User, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getUserProfileAPI, updateProfileImageAPI, updateUserProfileAPI } from "../../../api/userApi"
import { toast } from "react-toastify"

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

export default function ProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)


  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)


  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    profile_image: ""
  })


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfileAPI()
        if (response.success) {
          setFormData(response.data)
        }
      } catch (error) {
        console.error("Failed to load profile", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }


  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max 5MB.")
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
        } else {
          alert("Failed to update database")
        }
      }
    } catch (error) {
      console.error("Upload failed", error)
      alert("Image upload failed")
    } finally {
      setUploadingImg(false)
    }
  }


  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await updateUserProfileAPI({
        full_name: formData.full_name,
        phone: formData.phone,
        username: formData.username
      })

      if (response.success) {
        alert("Profile updated successfully!")
        navigate("/chats")
      } else {
        alert(response.message || "Failed to update profile")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
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
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6 max-w-lg mx-auto">

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={formData.profile_image} className="object-cover" />
                <AvatarFallback className="text-4xl bg-muted">
                  {formData.full_name?.charAt(0).toUpperCase() || <User className="h-16 w-16" />}
                </AvatarFallback>
              </Avatar>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />

              {/* Camera Button */}
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-lg"
                onClick={() => fileInputRef.current.click()}
                disabled={uploadingImg}
              >
                {uploadingImg ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {uploadingImg ? "Uploading..." : "Click camera to change photo"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="@username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
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
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
