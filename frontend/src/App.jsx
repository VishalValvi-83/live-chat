import { useState, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ChatsListPage from './pages/ChatsListPage'
import ChatConversationPage from './pages/ChatConversationPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import AccountSettingsPage from './pages/AccountSettingsPage'
import DemoPage from './pages/DemoPage'
import NotificationsSettingsPage from './pages/NotificationsSettingsPage'
import PrivacySettingsPage from './pages/PrivacySettingsPage'
import AppearanceSettingsPage from './pages/AppearanceSettingsPage'
import PreLoader from './components/PreLoader'
import './index.css'

export const PreloaderContext = createContext({ preloaderComplete: false })
export const usePreloader = () => useContext(PreloaderContext)

function App() {
  const [showPreLoader, setShowPreLoader] = useState(true)
  const [preloaderComplete, setPreloaderComplete] = useState(false)

  const handlePreloaderComplete = () => {
    setShowPreLoader(false)
    setPreloaderComplete(true)
  }

  return (
    <ThemeProvider>
      <PreloaderContext.Provider value={{ preloaderComplete }}>
        {showPreLoader && <PreLoader onComplete={handlePreloaderComplete} />}
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/demo" element={<DemoPage />} />
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
      </PreloaderContext.Provider>
    </ThemeProvider>
  )
}

export default App
