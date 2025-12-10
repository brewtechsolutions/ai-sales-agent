/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // 🎨 Primary brand color
        primary: {
          DEFAULT: '#0ea5e9', // Sky blue
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'primary-foreground': '#ffffff',
        
        // ✅ Semantic colors
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
          dark: '#065f46',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
          dark: '#991b1b',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
          dark: '#92400e',
        },
        info: {
          DEFAULT: '#3b82f6',
          light: '#dbeafe',
          dark: '#1e40af',
        },
        
        // 🌅 Light mode colors
        background: '#ffffff',
        surface: '#f9fafb',
        card: '#ffffff',
        'text-primary': '#111827',
        'text-secondary': '#6b7280',
        'text-tertiary': '#9ca3af',
        border: '#e5e7eb',
        
        // 🌙 Dark mode colors
        'dark-background': '#0f172a',
        'dark-surface': '#1e293b',
        'dark-card': '#334155',
        'dark-text-primary': '#f1f5f9',
        'dark-text-secondary': '#cbd5e1',
        'dark-text-tertiary': '#94a3b8',
        'dark-border': '#334155',
      },
      
      // iOS-style border radius
      borderRadius: {
        'ios': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
      },
      
      // iOS-style shadows
      boxShadow: {
        'ios': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'ios-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'ios-xl': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}