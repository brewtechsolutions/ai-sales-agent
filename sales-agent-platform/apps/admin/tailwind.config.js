/**
 * Tailwind CSS v4 Configuration for Nuxt
 * 
 * Tailwind v4 supports both CSS-first (@theme) and JS config approaches.
 * We use a hybrid approach:
 * - Static tokens (shadows, fonts) in CSS @theme directive
 * - Dynamic theme values (colors with CSS variables) in JS config
 * 
 * This allows runtime theming (light/dark mode) via CSS variables
 * while keeping static design tokens in CSS.
 * 
 * Files:
 * - Theme colors: tailwind.config.js (this file)
 * - CSS variables: assets/css/main.css (@layer base)
 * - Static tokens: assets/css/main.css (@theme directive)
 */

import animate from "tailwindcss-animate";
import { setupInspiraUI } from "@inspira-ui/plugins";

/** @type {import('tailwindcss').Config} */
export default {
  // Content paths for Tailwind to scan
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  
  // Dark mode configuration
  darkMode: "selector",
  
  // Theme configuration - maps CSS variables to Tailwind utilities
  theme: {
    extend: {
      colors: {
        // 🎨 Primary brand color
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(var(--primary-50))",
          100: "hsl(var(--primary-100))",
          200: "hsl(var(--primary-200))",
          300: "hsl(var(--primary-300))",
          400: "hsl(var(--primary-400))",
          500: "hsl(var(--primary))",
          600: "hsl(var(--primary-600))",
          700: "hsl(var(--primary-700))",
          800: "hsl(var(--primary-800))",
          900: "hsl(var(--primary-900))",
        },
        
        // 🎨 Secondary brand color
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        
        // ✅ Semantic colors
        success: {
          DEFAULT: "hsl(var(--success))",
          light: "hsl(var(--success-light))",
          dark: "hsl(var(--success-dark))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          light: "hsl(var(--error-light))",
          dark: "hsl(var(--error-dark))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          light: "hsl(var(--warning-light))",
          dark: "hsl(var(--warning-dark))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          light: "hsl(var(--info-light))",
          dark: "hsl(var(--info-dark))",
        },
        
        // 🌅 Light mode colors
        background: "hsl(var(--background))",
        surface: "hsl(var(--surface))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "text-primary": "hsl(var(--foreground))",
        "text-secondary": "hsl(var(--muted-foreground))",
        "text-tertiary": "hsl(var(--text-tertiary))",
        border: "hsl(var(--border))",
        
        // 🌙 Dark mode colors (used via dark: prefix)
        "dark-background": "hsl(var(--dark-background))",
        "dark-surface": "hsl(var(--dark-surface))",
        "dark-card": "hsl(var(--dark-card))",
        "dark-text-primary": "hsl(var(--dark-foreground))",
        "dark-text-secondary": "hsl(var(--dark-muted-foreground))",
        "dark-border": "hsl(var(--dark-border))",
        
        // Legacy shadcn/ui colors (for compatibility)
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      
      // iOS-style border radius (also defined in @theme, but kept here for compatibility)
      borderRadius: {
        'ios': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      // iOS-style shadows (also defined in @theme, but kept here for compatibility)
      boxShadow: {
        'ios': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'ios-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'ios-xl': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
      
      // System fonts (also defined in @theme, but kept here for compatibility)
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  
  // Plugins that require JS configuration
  plugins: [animate, setupInspiraUI],
}