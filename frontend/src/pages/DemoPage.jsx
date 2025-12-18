import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DemoPreloader from "@/components/DemoPreloader"

export default function DemoPage() {
  const navigate = useNavigate()
  const [showPreloader, setShowPreloader] = useState(true)

  const handlePreloaderComplete = () => {
    setShowPreloader(false)
    navigate("/chats")
  }

  return (
    <>
      {showPreloader && <DemoPreloader onComplete={handlePreloaderComplete} />}
    </>
  )
}
