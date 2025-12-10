import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className,
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng: 'en' | 'zh') => {
    i18n.changeLanguage(lng);
  };

  return (
    <View className={`flex-row gap-2 ${className || ''}`}>
      <TouchableOpacity
        onPress={() => changeLanguage('en')}
        className={`
          px-4 py-2 rounded-ios-lg
          ${currentLanguage === 'en' 
            ? 'bg-primary-500' 
            : 'bg-surface dark:bg-dark-surface'
          }
        `}
        accessibilityLabel="Switch to English"
        accessibilityRole="button"
      >
        <Text
          className={`
            font-semibold
            ${currentLanguage === 'en' 
              ? 'text-white' 
              : 'text-text-primary dark:text-dark-text-primary'
            }
          `}
        >
          English
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => changeLanguage('zh')}
        className={`
          px-4 py-2 rounded-ios-lg
          ${currentLanguage === 'zh' 
            ? 'bg-primary-500' 
            : 'bg-surface dark:bg-dark-surface'
          }
        `}
        accessibilityLabel="切换到中文"
        accessibilityRole="button"
      >
        <Text
          className={`
            font-semibold
            ${currentLanguage === 'zh' 
              ? 'text-white' 
              : 'text-text-primary dark:text-dark-text-primary'
            }
          `}
        >
          中文
        </Text>
      </TouchableOpacity>
    </View>
  );
};

