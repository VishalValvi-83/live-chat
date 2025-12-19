import { useNavigate } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  const navigate = useNavigate()
  const handleRegisterClick = () => {
    navigate("/register")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <MessageCircle className="h-8 w-8 text-blue-500" />
          <span className="font-bold text-2xl">VoxenApp</span>
        </div>
        <LoginForm onRegisterClick={handleRegisterClick} />
      </div>
    </div>
  )
}
