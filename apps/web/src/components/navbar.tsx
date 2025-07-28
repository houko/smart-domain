'use client'

import { LanguageSwitcher } from '@/components/language-switcher'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserNav } from '@/components/user-nav'
import { Github } from 'lucide-react'
import Link from 'next/link'
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-3 sm:px-4">
        <div className="mr-2 sm:mr-4 flex">
          <Link
            href="/"
            className="mr-2 sm:mr-4 md:mr-6 flex items-center group"
          >
            <Logo className="transition-transform group-hover:scale-105" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-1.5 md:space-x-2">
          <Link
            href="https://github.com/your-repo/smart-domain"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 md:h-9 md:w-9"
          >
            <Github className="h-3 w-3 md:h-4 md:w-4" />
            <span className="sr-only">GitHub</span>
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
