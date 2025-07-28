'use client'

import { LOCALES } from '@/constants'
import { useLocale, useTranslations } from 'next-intl'
import React from 'react'

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className = '', showText = true }: LogoProps) {
  const t = useTranslations('logo')
  const locale = useLocale()
  return (
    <div className={`flex items-center gap-2.5 whitespace-nowrap ${className}`}>
      {/* Logo Icon - Modern Fluid Design */}
      <div className="relative group">
        {/* Animated Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-all duration-300 animate-gradient-x" />

        {/* Main Logo SVG */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
          aria-label="Smart Domain Generator Logo"
        >
          <title>Smart Domain Generator Logo</title>
          {/* Gradient Definitions */}
          <defs>
            <linearGradient
              id="logo-gradient-1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient
              id="logo-gradient-2"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient
              id="logo-gradient-3"
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          {/* Background with subtle gradient */}
          <rect
            x="0"
            y="0"
            width="36"
            height="36"
            rx="10"
            fill="white"
            className="dark:fill-gray-900"
          />

          {/* Fluid Shape 1 - Main D Shape */}
          <path
            d="M10 10 C10 10, 10 10, 16 10 C22 10, 26 14, 26 18 C26 22, 22 26, 16 26 C10 26, 10 26, 10 26 C10 26, 10 18, 10 18 C10 14, 10 10, 10 10 Z"
            fill="url(#logo-gradient-1)"
            opacity="0.9"
          />

          {/* Fluid Shape 2 - Inner Flow */}
          <path
            d="M14 14 C14 14, 16 14, 18 14 C20 14, 22 16, 22 18 C22 20, 20 22, 18 22 C16 22, 14 22, 14 22 C14 22, 14 18, 14 18 C14 16, 14 14, 14 14 Z"
            fill="white"
            className="dark:fill-gray-900"
            opacity="0.95"
          />

          {/* Accent Elements */}
          <circle
            cx="24"
            cy="12"
            r="2.5"
            fill="url(#logo-gradient-2)"
            className="animate-pulse"
            opacity="0.8"
          />

          <circle
            cx="12"
            cy="24"
            r="1.5"
            fill="url(#logo-gradient-3)"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent whitespace-nowrap">
            {t('title') || 'Smart Domain'}
          </span>
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 -mt-0.5 whitespace-nowrap">
            {t('subtitle') ||
              (locale === LOCALES.ZH ? '起名助手' : 'Domain Generator')}
          </span>
        </div>
      )}
    </div>
  )
}

// Minimal Logo Variant for Small Spaces
export function LogoIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Smart Domain Generator Icon"
    >
      <title>Smart Domain Generator Icon</title>
      <defs>
        <linearGradient
          id="logo-icon-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      <rect
        x="0"
        y="0"
        width="32"
        height="32"
        rx="8"
        fill="white"
        className="dark:fill-gray-900"
      />

      <path
        d="M8 8 H16 C20.418 8 24 11.582 24 16 C24 20.418 20.418 24 16 24 H8 V8 Z"
        fill="url(#logo-icon-gradient)"
      />

      <path
        d="M12 12 H16 C18.209 12 20 13.791 20 16 C20 18.209 18.209 20 16 20 H12 V12 Z"
        fill="white"
        className="dark:fill-gray-900"
      />
    </svg>
  )
}

// Animated Logo Variant
export function AnimatedLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      {/* Rotating Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-xl opacity-75 blur-xl animate-gradient-x" />

      {/* Main Logo */}
      <div className="relative">
        <Logo showText={false} />
      </div>
    </div>
  )
}
