import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext(undefined)

const accentColorMap = {
  blue: { 
    light: { primary: "221.2 83.2% 53.3%", ring: "221.2 83.2% 53.3%" }, 
    dark: { primary: "217.2 91.2% 59.8%", ring: "224.3 76.3% 48%" } 
  },
  green: { 
    light: { primary: "142.1 76.2% 36.3%", ring: "142.1 76.2% 36.3%" }, 
    dark: { primary: "142.1 70.6% 45.3%", ring: "142.1 70.6% 45.3%" } 
  },
  purple: { 
    light: { primary: "262.1 83.3% 57.8%", ring: "262.1 83.3% 57.8%" }, 
    dark: { primary: "263.4 70% 50.4%", ring: "263.4 70% 50.4%" } 
  },
  pink: { 
    light: { primary: "330.4 81.2% 60.4%", ring: "330.4 81.2% 60.4%" }, 
    dark: { primary: "330.4 85% 60%", ring: "330.4 85% 60%" } 
  },
  orange: { 
    light: { primary: "24.6 95% 53.1%", ring: "24.6 95% 53.1%" }, 
    dark: { primary: "20.5 90.2% 48.2%", ring: "20.5 90.2% 48.2%" } 
  },
  red: { 
    light: { primary: "0 72.2% 50.6%", ring: "0 72.2% 50.6%" }, 
    dark: { primary: "0 72.2% 60.6%", ring: "0 72.2% 60.6%" } 
  },
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("dark")
  const [accentColor, setAccentColorState] = useState("blue")
  const [resolvedTheme, setResolvedTheme] = useState("dark")

  const applyAccentColor = (color, isDark) => {
    const colors = accentColorMap[color]
    if (colors) {
      const colorValue = isDark ? colors.dark : colors.light
      document.documentElement.style.setProperty("--primary", colorValue.primary)
      document.documentElement.style.setProperty("--ring", colorValue.ring)
    }
  }

  const applyTheme = (newTheme, accent) => {
    let isDark = false
    
    if (newTheme === "dark") {
      isDark = true
    } else if (newTheme === "system") {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    }

    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    setResolvedTheme(isDark ? "dark" : "light")
    applyAccentColor(accent, isDark)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark"
    const savedAccent = localStorage.getItem("accentColor") || "blue"
    
    setThemeState(savedTheme)
    setAccentColorState(savedAccent)
    applyTheme(savedTheme, savedAccent)

    if (savedTheme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => applyTheme("system", savedAccent)
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  const setTheme = (newTheme) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme, accentColor)
  }

  const setAccentColor = (color) => {
    setAccentColorState(color)
    localStorage.setItem("accentColor", color)
    const isDark = document.documentElement.classList.contains("dark")
    applyAccentColor(color, isDark)
  }

  const getAccentHex = () => {
    const hexMap = {
      blue: { light: "#3b82f6", dark: "#60a5fa" },
      green: { light: "#22c55e", dark: "#4ade80" },
      purple: { light: "#a855f7", dark: "#c084fc" },
      pink: { light: "#ec4899", dark: "#f472b6" },
      orange: { light: "#f97316", dark: "#fb923c" },
      red: { light: "#ef4444", dark: "#f87171" },
    }
    return hexMap[accentColor]?.[resolvedTheme] || hexMap.blue[resolvedTheme]
  }

  const getBackgroundColor = () => {
    return resolvedTheme === "dark" ? "#030712" : "#ffffff"
  }

  const getForegroundColor = () => {
    return resolvedTheme === "dark" ? "#f8fafc" : "#0f172a"
  }

  const getMutedColor = () => {
    return resolvedTheme === "dark" ? "#1e293b" : "#f1f5f9"
  }

  const getBorderColor = () => {
    return resolvedTheme === "dark" ? "#1e293b" : "#e2e8f0"
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        accentColor,
        setAccentColor,
        resolvedTheme,
        getAccentHex,
        getBackgroundColor,
        getForegroundColor,
        getMutedColor,
        getBorderColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
