'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="h-8 w-8 md:h-9 md:w-9"
    >
      <Sun className="h-4 w-4 md:h-[1.2rem] md:w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 md:h-[1.2rem] md:w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
