"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ReactNode } from "react"

interface ClientThemeProviderProps {
  children: ReactNode
}

export function ClientThemeProvider({ children }: ClientThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemesProvider>
  )
} 