import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ChatsListPage from './pages/ChatsListPage'
import ChatConversationPage from './pages/ChatConversationPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import AccountSettingsPage from './pages/AccountSettingsPage'
import NotificationsSettingsPage from './pages/NotificationsSettingsPage'
import PrivacySettingsPage from './pages/PrivacySettingsPage'
import AppearanceSettingsPage from './pages/AppearanceSettingsPage'
import './index.css'

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light"
    const savedAccent = localStorage.getItem("accentColor") || "blue"
    
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
    
    const colorMap = {
      blue: { light: "221.2 83.2% 53.3%", dark: "217.2 91.2% 59.8%" },
      green: { light: "142.1 76.2% 36.3%", dark: "142.1 70.6% 45.3%" },
      purple: { light: "262.1 83.3% 57.8%", dark: "263.4 70% 50.4%" },
      pink: { light: "330.4 81.2% 60.4%", dark: "330.4 85% 60%" },
      orange: { light: "24.6 95% 53.1%", dark: "20.5 90.2% 48.2%" },
      red: { light: "0 72.2% 50.6%", dark: "0 72.2% 60.6%" },
    }
    
    const colors = colorMap[savedAccent]
    if (colors) {
      const isDark = document.documentElement.classList.contains("dark")
      const colorValue = isDark ? colors.dark : colors.light
      document.documentElement.style.setProperty("--primary", colorValue)
      document.documentElement.style.setProperty("--ring", colorValue)
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chats" element={<ChatsListPage />} />
        <Route path="/chats/:id" element={<ChatConversationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/account" element={<AccountSettingsPage />} />
        <Route path="/settings/notifications" element={<NotificationsSettingsPage />} />
        <Route path="/settings/privacy" element={<PrivacySettingsPage />} />
        <Route path="/settings/appearance" element={<AppearanceSettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  )
}

export default App
