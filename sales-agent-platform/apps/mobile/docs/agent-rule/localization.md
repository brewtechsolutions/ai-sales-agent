# Localization Guide

## Overview

The mobile app supports multiple languages using i18next and expo-localization. Currently supported languages:
- **English (en)** - Default
- **Chinese (zh)** - Simplified Chinese

## Setup

### Installation

The i18n setup is already configured. If you need to add it:

```bash
bun add i18next react-i18next expo-localization
```

### Configuration

i18n is configured in `utils/i18n.ts`:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from '../locales/en.json';
import zh from '../locales/zh.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    lng: Localization.getLocales()[0]?.languageCode || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

## Usage in Components

### Basic Usage

```tsx
import { useTranslation } from 'react-i18next';

export const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t('welcome')}</Text>
      <Button title={t('signIn')} />
    </View>
  );
};
```

### With Interpolation

```tsx
const { t } = useTranslation();

// Translation: "Hello, {{name}}!"
<Text>{t('greeting', { name: 'John' })}</Text>
```

### Changing Language

```tsx
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View>
      <Button title="English" onPress={() => changeLanguage('en')} />
      <Button title="中文" onPress={() => changeLanguage('zh')} />
    </View>
  );
};
```

## Translation Files

### File Structure

```
locales/
├── en.json  # English translations
└── zh.json  # Chinese translations
```

### Translation File Format

**locales/en.json:**
```json
{
  "common": {
    "welcome": "Welcome",
    "signIn": "Sign In",
    "signOut": "Sign Out",
    "cancel": "Cancel",
    "confirm": "Confirm"
  },
  "auth": {
    "email": "Email",
    "password": "Password",
    "login": "Login",
    "register": "Register"
  },
  "products": {
    "title": "Products",
    "add": "Add Product",
    "edit": "Edit Product",
    "delete": "Delete Product"
  }
}
```

**locales/zh.json:**
```json
{
  "common": {
    "welcome": "欢迎",
    "signIn": "登录",
    "signOut": "登出",
    "cancel": "取消",
    "confirm": "确认"
  },
  "auth": {
    "email": "邮箱",
    "password": "密码",
    "login": "登录",
    "register": "注册"
  },
  "products": {
    "title": "产品",
    "add": "添加产品",
    "edit": "编辑产品",
    "delete": "删除产品"
  }
}
```

### Using Nested Keys

```tsx
// Access nested keys with dot notation
<Text>{t('common.welcome')}</Text>
<Text>{t('auth.email')}</Text>
```

## Best Practices

### ✅ Do

1. **Use descriptive keys:**
   ```json
   {
     "auth.loginButton": "Login",
     "auth.registerButton": "Register"
   }
   ```

2. **Group related translations:**
   ```json
   {
     "auth": {
       "email": "Email",
       "password": "Password"
     }
   }
   ```

3. **Use interpolation for dynamic content:**
   ```json
   {
     "greeting": "Hello, {{name}}!"
   }
   ```

4. **Keep translations in sync:**
   - Always add keys to both `en.json` and `zh.json`
   - Use the same key structure in both files

5. **Use pluralization when needed:**
   ```json
   {
     "items": "{{count}} item",
     "items_plural": "{{count}} items"
   }
   ```

### ❌ Don't

1. **Don't hardcode strings:**
   ```tsx
   // ❌ Wrong
   <Text>Welcome</Text>
   
   // ✅ Correct
   <Text>{t('welcome')}</Text>
   ```

2. **Don't use keys that don't exist:**
   - Always create translation keys before using them
   - Check both language files

3. **Don't forget to add Chinese translations:**
   - Every key in `en.json` must exist in `zh.json`

4. **Don't use concatenation for translations:**
   ```tsx
   // ❌ Wrong
   <Text>{t('hello') + ' ' + name}</Text>
   
   // ✅ Correct
   <Text>{t('greeting', { name })}</Text>
   ```

## Adding New Translations

### Step 1: Add to English (en.json)

```json
{
  "newFeature": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}
```

### Step 2: Add to Chinese (zh.json)

```json
{
  "newFeature": {
    "title": "新功能",
    "description": "这是一个新功能"
  }
}
```

### Step 3: Use in Component

```tsx
const { t } = useTranslation();

<Text>{t('newFeature.title')}</Text>
<Text>{t('newFeature.description')}</Text>
```

## Testing Translations

### Manual Testing

1. Change device language in settings
2. Restart app to see new language
3. Or use language switcher in app

### Automated Testing

```tsx
import { render } from '@testing-library/react-native';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/i18n';

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  );
};
```

## Common Patterns

### Error Messages

```json
{
  "errors": {
    "required": "This field is required",
    "email": "Please enter a valid email",
    "password": "Password must be at least 8 characters"
  }
}
```

```tsx
<Text className="text-error">
  {t(`errors.${errorType}`)}
</Text>
```

### Form Labels

```json
{
  "forms": {
    "email": "Email Address",
    "password": "Password",
    "confirmPassword": "Confirm Password"
  }
}
```

```tsx
<Input
  label={t('forms.email')}
  placeholder={t('forms.email')}
/>
```

### Button Labels

```json
{
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel",
    "delete": "Delete",
    "save": "Save"
  }
}
```

```tsx
<Button title={t('buttons.submit')} />
```

## Troubleshooting

### Translation Not Showing

**Problem**: Key shows as "key" instead of translation

**Solutions**:
1. Check key exists in both `en.json` and `zh.json`
2. Verify key spelling matches exactly
3. Check i18n is initialized before component renders
4. Restart app after adding new translations

### Language Not Changing

**Problem**: Language doesn't change when switching

**Solutions**:
1. Check `i18n.changeLanguage()` is called
2. Verify language code is correct ('en' or 'zh')
3. Check i18n configuration
4. Ensure component re-renders after language change

## Related Documentation

- [Core Rules](./core-rules.md) - Coding standards
- [Component Standards](./component-standards.md) - Component guidelines
- [Theme Configuration](./theme-configuration.md) - Theme setup

