"use client"

import { AuthProvider } from "./auth-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        defaultTheme="system"
        storageKey="smart-timetable-theme"
      >
        {children}
      </ThemeProvider>
    </AuthProvider>
  )
}