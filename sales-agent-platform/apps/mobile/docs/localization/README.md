# Localization Documentation

## Overview

The mobile app supports multiple languages using i18next and expo-localization.

## Supported Languages

- **English (en)** - Default language
- **Chinese (zh)** - Simplified Chinese

## Quick Start

### Using Translations in Components

```tsx
import { useTranslation } from 'react-i18next';

export const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t('common.welcome')}</Text>
      <Button title={t('auth.signIn')} />
    </View>
  );
};
```

### Changing Language

```tsx
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
i18n.changeLanguage('zh'); // Switch to Chinese
i18n.changeLanguage('en'); // Switch to English
```

## Translation Files

Translation files are located in `locales/`:
- `locales/en.json` - English translations
- `locales/zh.json` - Chinese translations

## Adding New Translations

1. Add key to `locales/en.json`
2. Add same key to `locales/zh.json`
3. Use in component: `t('key')`

## Language Switcher Component

Use the `LanguageSwitcher` component to allow users to switch languages:

```tsx
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

<LanguageSwitcher />
```

## Best Practices

- ✅ Always use `t('key')` for user-facing text
- ✅ Keep translation keys organized by feature
- ✅ Add translations to both languages
- ✅ Use descriptive key names
- ✅ Use interpolation for dynamic content

## Related Documentation

- [AI Agent Rules - Localization](../agent-rule/localization.md) - Detailed i18n guide
- [Component Standards](../agent-rule/component-standards.md) - Component guidelines

