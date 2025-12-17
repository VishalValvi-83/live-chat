import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Sun, Moon, Monitor, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AppearanceSettingsPage() {
  const navigate = useNavigate()
  const [theme, setTheme] = useState("light")
  const [accentColor, setAccentColor] = useState("blue")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light"
    const savedAccent = localStorage.getItem("accentColor") || "blue"
    setTheme(savedTheme)
    setAccentColor(savedAccent)
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    }
    applyAccentColor(savedAccent)
  }, [])

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }

    applyAccentColor(accentColor)
  }

  const themeOptions = [
    { value: "light", icon: Sun, label: "Light", description: "Light theme" },
    { value: "dark", icon: Moon, label: "Dark", description: "Dark theme" },
    { value: "system", icon: Monitor, label: "System", description: "Follow system setting" },
  ]

  const applyAccentColor = (color) => {
    const colorMap = {
      blue: { light: "221.2 83.2% 53.3%", dark: "217.2 91.2% 59.8%" },
      green: { light: "142.1 76.2% 36.3%", dark: "142.1 70.6% 45.3%" },
      purple: { light: "262.1 83.3% 57.8%", dark: "263.4 70% 50.4%" },
      pink: { light: "330.4 81.2% 60.4%", dark: "330.4 85% 60%" },
      orange: { light: "24.6 95% 53.1%", dark: "20.5 90.2% 48.2%" },
      red: { light: "0 72.2% 50.6%", dark: "0 72.2% 60.6%" },
    }

    const colors = colorMap[color]
    if (colors) {
      const isDark = document.documentElement.classList.contains("dark")
      const colorValue = isDark ? colors.dark : colors.light
      document.documentElement.style.setProperty("--primary", colorValue)
      document.documentElement.style.setProperty("--ring", colorValue)
    }
  }

  const handleAccentColorChange = (color) => {
    setAccentColor(color)
    localStorage.setItem("accentColor", color)
    applyAccentColor(color)
  }

  const accentColors = [
    { value: "blue", color: "bg-blue-500" },
    { value: "green", color: "bg-green-500" },
    { value: "purple", color: "bg-purple-500" },
    { value: "pink", color: "bg-pink-500" },
    { value: "orange", color: "bg-orange-500" },
    { value: "red", color: "bg-red-500" },
  ]

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
          <h1 className="text-xl font-bold">Appearance</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-3">Theme</h2>
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleThemeChange(option.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-colors ${theme === option.value
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover:bg-accent"
                  }`}
              >
                <option.icon className="h-5 w-5" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{option.label}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                {theme === option.value && (
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Accent Color
            </h2>
            <div className="grid grid-cols-6 gap-3 p-4 bg-card rounded-lg border border-border">
              {accentColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleAccentColorChange(color.value)}
                  className={`h-12 w-12 rounded-full ${color.color} relative ${accentColor === color.value ? "ring-2 ring-offset-2 ring-primary" : ""
                    }`}
                >
                  {accentColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-card rounded-lg border border-border">
            <h3 className="font-medium mb-2">Preview</h3>
            <div className="space-y-2">
              <div className="p-3 bg-primary text-primary-foreground rounded-lg">
                Primary Button Style
              </div>
              <div className="p-3 bg-secondary text-secondary-foreground rounded-lg">
                Secondary Style
              </div>
              <div className="p-3 bg-muted text-muted-foreground rounded-lg">
                Muted Style
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
