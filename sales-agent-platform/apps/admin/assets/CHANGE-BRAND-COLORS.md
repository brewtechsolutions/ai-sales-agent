# How to Change Brand Colors - Quick Guide

## TL;DR - 3 Steps

1. **Get your color in HSL format** (e.g., `217 91% 60%`)
2. **Update `assets/css/main.css`** - Replace `--primary` values
3. **Restart dev server** and hard refresh browser

## Step-by-Step

### Step 1: Convert Your Color to HSL

If you have a hex color like `#3B82F6`:
- Use [HSL Color Picker](https://hslpicker.com/) to convert
- Or use browser DevTools color picker
- Format: `H S% L%` (e.g., `217 91% 60%`)

### Step 2: Update CSS Variables

Edit **`apps/admin/assets/css/main.css`**:

**Find these sections and replace the HSL values:**

```css
@layer base {
  :root {
    /* 🎨 Primary brand color - CHANGE THESE */
    --primary: 221.2 83.2% 53.3%;  /* ← Your main color here */
    --primary-foreground: 210 40% 98%;
    --primary-50: 204 100% 97%;
    --primary-100: 204 96% 94%;
    --primary-200: 201 96% 89%;
    --primary-300: 199 95% 80%;
    --primary-400: 196 94% 68%;
    --primary-600: 213 94% 43%;
    --primary-700: 217 91% 36%;
    --primary-800: 222 84% 30%;
    --primary-900: 224 76% 25%;
  }

  .dark {
    /* 🎨 Primary brand color (Dark Mode) - CHANGE THESE TOO */
    --primary: 217.2 91.2% 59.8%;  /* ← Slightly lighter for dark mode */
    --primary-foreground: 222.2 47.4% 11.2%;
    /* ... rest of scale ... */
  }
}
```

**Also update `@theme` section (around line 159):**

```css
@theme {
  /* 🎨 Primary brand color - Maps CSS variables to Tailwind */
  --color-primary: hsl(var(--primary));
  --color-primary-500: hsl(var(--primary));
  /* ... etc ... */
  
  /* Override blue to use your primary */
  --color-blue: hsl(var(--primary));
  --color-blue-500: hsl(var(--primary));
  /* ... etc ... */
}
```

### Step 3: Generate Color Scale (Optional but Recommended)

For a full color scale (50-900), use:
- [uicolors.app](https://uicolors.app/create) - Enter your hex color, get full scale
- Copy the HSL values to replace `--primary-50` through `--primary-900`

### Step 4: Restart & Refresh

```bash
# Stop dev server (Ctrl+C)
bun run dev

# Then hard refresh browser:
# Mac: Cmd + Shift + R
# Windows: Ctrl + Shift + R
```

## Quick Example

**If your brand color is `#8B5CF6` (Purple):**

1. Convert to HSL: `262 83% 58%`
2. Replace in `main.css`:
   ```css
   --primary: 262 83% 58%;  /* Light mode */
   ```
   ```css
   --primary: 262 83% 65%;  /* Dark mode (slightly lighter) */
   ```
3. Restart dev server
4. Done! ✨

## What Gets Updated Automatically

Once you change `--primary` in CSS, these automatically update:
- ✅ All buttons with `bg-primary`
- ✅ All links with `text-primary`
- ✅ All icons with `text-primary`
- ✅ Focus rings with `ring-primary`
- ✅ Brand icon backgrounds
- ✅ Everything using primary color

## Files to Edit

**Only edit this file:**
- `apps/admin/assets/css/main.css`
  - Line ~189: `:root` section (light mode)
  - Line ~247: `.dark` section (dark mode)
  - Line ~159: `@theme` section (already uses CSS variables, no change needed)

**Don't edit:**
- ❌ `tailwind.config.js` - Already configured
- ❌ `app.config.ts` - Leave as is

## Troubleshooting

**Still seeing old colors?**
1. Hard refresh browser (Cmd+Shift+R)
2. Clear browser cache
3. Restart dev server

**Colors look wrong?**
- Check HSL format: `H S% L%` (no commas!)
- Make sure you updated both `:root` and `.dark` sections

## That's It!

Change `--primary` in `main.css` → Restart → Done! 🎨

