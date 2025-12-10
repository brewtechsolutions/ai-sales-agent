import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { COUNTRIES, Country, DEFAULT_COUNTRY } from '../../constants/countries';
import * as Haptics from 'expo-haptics';

interface CountryPickerProps {
  selectedCountry: Country;
  onSelect: (country: Country) => void;
  visible: boolean;
  onClose: () => void;
}

export const CountryPicker: React.FC<CountryPickerProps> = ({
  selectedCountry,
  onSelect,
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return COUNTRIES;
    }
    const query = searchQuery.toLowerCase();
    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.dialCode.includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelect = (country: Country) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(country);
    onClose();
    setSearchQuery('');
  };

  const colors = {
    background: isDark ? '#0f172a' : '#ffffff',
    surface: isDark ? '#1e293b' : '#f9fafb',
    card: isDark ? '#334155' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#111827',
    textSecondary: isDark ? '#cbd5e1' : '#6b7280',
    border: isDark ? '#334155' : '#e5e7eb',
    searchBackground: isDark ? '#1e293b' : '#ffffff',
  };

  const renderCountry = ({ item }: { item: Country }) => {
    const isSelected = item.code === selectedCountry.code;

    return (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        style={[
          styles.countryItem,
          {
            backgroundColor: isSelected
              ? isDark
                ? 'rgba(14, 165, 233, 0.2)'
                : 'rgba(14, 165, 233, 0.1)'
              : colors.card,
            borderBottomColor: colors.border,
          },
        ]}
        accessibilityLabel={`${item.name}, ${item.dialCode}`}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
      >
        <View className="flex-row items-center flex-1">
          <Text style={styles.flag}>{item.flag}</Text>
          <View className="flex-1 ml-3">
            <Text
              style={[
                styles.countryName,
                { color: colors.text },
                isSelected && { fontWeight: '600' },
              ]}
            >
              {item.name}
            </Text>
          </View>
          <Text style={[styles.dialCode, { color: colors.textSecondary }]}>
            {item.dialCode}
          </Text>
          {isSelected && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              className="ml-3"
            >
              <MaterialIcons name="check-circle" size={24} color="#0ea5e9" />
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View className="flex-row items-center justify-between px-4 py-4">
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {t('auth.selectCountry')}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2"
              accessibilityLabel={t('common.close')}
              accessibilityRole="button"
            >
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="px-4 pb-4">
            <View
              style={[
                styles.searchContainer,
                {
                  backgroundColor: colors.searchBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialIcons name="search" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder={t('auth.searchCountry')}
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel={t('auth.searchCountry')}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  className="p-1"
                  accessibilityLabel={t('common.close')}
                  accessibilityRole="button"
                >
                  <MaterialIcons name="clear" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Country List */}
        <FlatList
          data={filteredCountries}
          renderItem={renderCountry}
          keyExtractor={(item) => item.code}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={true}
          ListEmptyComponent={
            <View className="items-center justify-center py-12 px-6">
              <MaterialIcons name="search-off" size={48} color={colors.textSecondary} />
              <Text
                style={[styles.emptyText, { color: colors.textSecondary }]}
                className="mt-4 text-center"
              >
                {t('auth.noCountryFound')}
              </Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    padding: 0,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    minHeight: 64,
  },
  flag: {
    fontSize: 28,
  },
  countryName: {
    fontSize: 16,
  },
  dialCode: {
    fontSize: 16,
    marginRight: 8,
  },
  emptyText: {
    fontSize: 16,
  },
});

