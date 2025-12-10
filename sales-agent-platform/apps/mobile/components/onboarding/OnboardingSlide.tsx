import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@/hooks/useColorScheme';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingSlideProps {
  title: string;
  titleKey?: string;
  description: string;
  descriptionKey?: string;
  icon?: string;
  image?: number;
  index: number;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  titleKey,
  description,
  descriptionKey,
  icon,
  image,
  index,
}) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const displayTitle = titleKey ? t(titleKey) : title;
  const displayDescription = descriptionKey ? t(descriptionKey) : description;

  return (
    <View
      className="flex-1 items-center justify-center px-6"
      style={{ width: SCREEN_WIDTH }}
    >
      {/* Animated Icon/Image Container */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(600).springify()}
        className="mb-8 items-center justify-center"
        style={{ height: SCREEN_HEIGHT * 0.4 }}
      >
        {image ? (
          <Image
            source={image}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel={displayTitle}
          />
        ) : icon ? (
          <View
            className="rounded-full items-center justify-center"
            style={[
              styles.iconContainer,
              {
                backgroundColor: isDark
                  ? 'rgba(2, 132, 199, 0.2)'
                  : 'rgba(14, 165, 233, 0.1)',
              },
            ]}
          >
            <Text style={[styles.icon, { color: isDark ? '#38bdf8' : '#0ea5e9' }]}>
              {icon}
            </Text>
          </View>
        ) : (
          <View
            className="rounded-ios-xl items-center justify-center"
            style={[
              styles.placeholder,
              {
                backgroundColor: isDark
                  ? 'rgba(2, 132, 199, 0.2)'
                  : 'rgba(14, 165, 233, 0.1)',
              },
            ]}
          >
            <Text
              className="text-6xl"
              style={{ color: isDark ? '#38bdf8' : '#0ea5e9' }}
            >
              ✨
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Animated Title */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(600).springify()}
        className="mb-4"
      >
        <Text
          className="text-3xl font-bold text-center"
          style={{
            color: isDark ? '#f1f5f9' : '#111827',
          }}
        >
          {displayTitle}
        </Text>
      </Animated.View>

      {/* Animated Description */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(600).springify()}
        className="px-4"
      >
        <Text
          className="text-base text-center leading-6"
          style={{
            color: isDark ? '#cbd5e1' : '#6b7280',
          }}
        >
          {displayDescription}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.4,
  },
  iconContainer: {
    width: 120,
    height: 120,
  },
  icon: {
    fontSize: 64,
  },
  placeholder: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.3,
  },
});

