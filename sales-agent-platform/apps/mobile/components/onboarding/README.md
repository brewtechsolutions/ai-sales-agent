# Onboarding Components

## Overview

Beautiful, animated onboarding carousel component following iOS design principles and wellness app patterns. Features smooth animations, haptic feedback, and a polished user experience.

## Components

### `OnboardingCarousel`

Main carousel component that displays onboarding slides with smooth animations.

**Features:**
- ✅ Animated pagination dots with spring animations
- ✅ Smooth slide transitions
- ✅ Haptic feedback on slide changes
- ✅ Skip button
- ✅ Auto-saves onboarding completion status
- ✅ Final slide shows Login/Signup buttons
- ✅ Full dark mode support
- ✅ iOS-inspired design
- ✅ Accessibility support

**Props:**
```typescript
interface OnboardingCarouselProps {
  slides: OnboardingSlideData[];
  onComplete: () => void;
}
```

### `OnboardingSlide`

Individual slide component with animated content.

**Features:**
- ✅ Fade-in animations for title and description
- ✅ Icon or image support
- ✅ Responsive layout
- ✅ Dark mode support
- ✅ Semantic colors

**Props:**
```typescript
interface OnboardingSlideProps {
  title: string;
  titleKey?: string;
  description: string;
  descriptionKey?: string;
  icon?: string;
  image?: number;
  index: number;
}
```

## Usage

```tsx
import { OnboardingCarousel } from '@/components/onboarding/OnboardingCarousel';

const ONBOARDING_SLIDES = [
  {
    titleKey: "onboarding.slide1.title",
    descriptionKey: "onboarding.slide1.description",
    icon: "🚀",
  },
  {
    titleKey: "onboarding.slide2.title",
    descriptionKey: "onboarding.slide2.description",
    icon: "✨",
  },
  {
    titleKey: "onboarding.slide3.title",
    descriptionKey: "onboarding.slide3.description",
    icon: "🎯",
  },
];

<OnboardingCarousel 
  slides={ONBOARDING_SLIDES} 
  onComplete={handleComplete} 
/>
```

## Design Principles

### iOS-Inspired Design
- Rounded corners (`rounded-ios`, `rounded-ios-lg`)
- Subtle shadows (`shadow-ios`)
- Generous spacing (16px, 24px, 32px)
- Smooth animations (200-300ms)
- Haptic feedback

### Accessibility
- Minimum 44x44px touch targets
- Proper contrast ratios (WCAG AA)
- Screen reader support
- Keyboard navigation

### Dark Mode
- All colors support dark mode
- Semantic color names
- Automatic theme adaptation

## Localization

All text uses i18n keys:
- `onboarding.skip` - Skip button
- `onboarding.next` - Next button
- `onboarding.slide1.title` - First slide title
- `onboarding.slide1.description` - First slide description
- etc.

## Animations

Uses `react-native-reanimated` for smooth 60fps animations:
- Fade-in animations for content
- Spring animations for pagination dots
- Smooth scroll transitions

## Storage

Onboarding completion status is saved to AsyncStorage:
- Key: `has_seen_onboarding`
- Value: `"true"` when completed

This ensures users only see onboarding once.

