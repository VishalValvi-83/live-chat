import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Camera, Loader2, Save, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"
import { getUserProfileAPI, updateUserProfileAPI } from "../../../api/userApi"
export default function ProfilePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    profile_image: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getUserProfileAPI();
      if (response.success) {
        setFormData(response.data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSave = async () => {
    setSaving(true);
    const response = await updateUserProfileAPI({
      full_name: formData.full_name,
      phone: formData.phone,

    });

    if (response.success) {
      toast.success("Profile updated!");
    } else {
      toast.error("Failed: " + response.message);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-4 py-4 flex justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
        <Button
          className=""
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""} Save
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">

        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={formData.profile_image} />
              <AvatarFallback className="text-2xl">
                {formData.full_name?.charAt(0).toUpperCase() || <User />}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md"
              onClick={() => toast.info("Image upload feature coming soon!")}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">@{formData.username}</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={formData.email}
              
              disabled
              className="bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="+1 234 567 890"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
