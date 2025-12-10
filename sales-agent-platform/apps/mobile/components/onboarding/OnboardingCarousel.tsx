import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@/hooks/useColorScheme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { OnboardingSlide } from './OnboardingSlide';
import { Button } from '../common/Button';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlideData {
  titleKey: string;
  descriptionKey: string;
  icon?: string;
  image?: number;
}

interface OnboardingCarouselProps {
  slides: OnboardingSlideData[];
  onComplete: () => void;
}

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({
  slides,
  onComplete,
}) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = offsetX;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== currentIndex) {
      setCurrentIndex(index);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlideData; index: number }) => (
    <OnboardingSlide
      titleKey={item.titleKey}
      descriptionKey={item.descriptionKey}
      icon={item.icon}
      image={item.image}
      index={index}
    />
  );

  const renderPagination = () => {
    return (
      <View className="flex-row items-center justify-center mb-8">
        {slides.map((_, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
              (index - 1) * SCREEN_WIDTH,
              index * SCREEN_WIDTH,
              (index + 1) * SCREEN_WIDTH,
            ];
            const scale = interpolate(scrollX.value, inputRange, [0.8, 1.2, 0.8], 'clamp');
            const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], 'clamp');

            return {
              transform: [{ scale: withSpring(scale) }],
              opacity: withSpring(opacity),
            };
          });

          return (
            <Animated.View
              key={index}
              style={[
                {
                  width: index === currentIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  marginHorizontal: 4,
                  backgroundColor: isDark ? '#38bdf8' : '#0ea5e9',
                },
                animatedStyle,
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      {/* Skip Button */}
      <View className="absolute top-12 right-6 z-10">
        <Button
          title={t('onboarding.skip')}
          onPress={handleSkip}
          variant="outline"
          size="sm"
        />
      </View>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(_, index) => `slide-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          // Handle scroll to index failure gracefully
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          });
        }}
      />

      {/* Pagination Dots */}
      {renderPagination()}

      {/* Action Buttons */}
      <View className="px-6 pb-8">
        {currentIndex < slides.length - 1 ? (
          <Button
            title={t('onboarding.next')}
            onPress={handleNext}
            variant="primary"
            size="lg"
          />
        ) : (
          <View>
            <Button
              title={t('auth.login')}
              onPress={() => {
                onComplete();
              }}
              variant="primary"
              size="lg"
            />
            <View className="mt-4">
              <Button
                title={t('auth.signUp')}
                onPress={() => {
                  onComplete();
                  router.push('/(app)/register');
                }}
                variant="outline"
                size="lg"
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

