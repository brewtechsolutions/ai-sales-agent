import animate from "tailwindcss-animate";
import { setupInspiraUI } from "@inspira-ui/plugins";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  safelist: ["dark"],
  prefix: "",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
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
        
        // 🌙 Dark mode colors (will be used via dark: prefix)
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
      
      // iOS-style border radius
      borderRadius: {
        'ios': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      // iOS-style shadows
      boxShadow: {
        'ios': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'ios-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'ios-xl': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
      
      // System fonts
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
    },
  },

  plugins: [animate, setupInspiraUI],
}