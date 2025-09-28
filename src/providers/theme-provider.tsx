"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { ThemeConfig } from "@/types"

interface ThemeContextType {
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void
  toggleMode: () => void
}

const defaultTheme: ThemeConfig = {
  mode: "system",
  primaryColor: "blue",
  accentColor: "emerald",
  borderRadius: "md"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeConfig>(defaultTheme)

  const setTheme = (newTheme: Partial<ThemeConfig>) => {
    const updatedTheme = { ...theme, ...newTheme }
    setThemeState(updatedTheme)
    localStorage.setItem("theme", JSON.stringify(updatedTheme))
  }

  const toggleMode = () => {
    const newMode = theme.mode === "dark" ? "light" : theme.mode === "light" ? "system" : "dark"
    setTheme({ mode: newMode })
  }

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setThemeState({ ...defaultTheme, ...parsed })
      } catch {
        setThemeState(defaultTheme)
      }
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    
    // Apply theme mode
    if (theme.mode === "dark") {
      root.classList.add("dark")
    } else if (theme.mode === "light") {
      root.classList.remove("dark")
    } else {
      // system
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      if (mediaQuery.matches) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }

    // Apply border radius
    root.style.setProperty("--radius", 
      theme.borderRadius === "none" ? "0px" :
      theme.borderRadius === "sm" ? "0.125rem" :
      theme.borderRadius === "md" ? "0.375rem" :
      theme.borderRadius === "lg" ? "0.5rem" : "1rem"
    )
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}