import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTRPC } from "../../../utils/trpc";
import { useQuery } from "@tanstack/react-query";

export default function DashboardScreen() {
  const { t } = useTranslation();
  const trpc = useTRPC();
  const { data: stats, isLoading: statsLoading } = useQuery(
    trpc.product.getStats.queryOptions()
  );

  const { data: recentProducts, isLoading: productsLoading } = useQuery(
    trpc.product.getAll.queryOptions({
      page: 1,
      pageSize: 5,
    })
  );

  if (statsLoading || productsLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-dark-background items-center justify-center">
        <Text className="text-text-primary dark:text-dark-text-primary">
          {t("common.loading")}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-surface dark:bg-dark-surface">
      {/* Header */}
      <View className="bg-card dark:bg-dark-card p-4">
        <Text className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
          {t("dashboard.title")}
        </Text>
        <Text className="text-text-secondary dark:text-dark-text-secondary">
          {t("dashboard.welcomeBack")}
        </Text>
      </View>

      {/* Statistics */}
      <View className="flex-row flex-wrap p-4">
        <View className="w-1/2 p-2">
          <View className="bg-card dark:bg-dark-card rounded-ios shadow-ios p-4">
            <Text className="text-text-secondary dark:text-dark-text-secondary">
              {t("dashboard.totalProducts")}
            </Text>
            <Text className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              {stats?.totalProducts || 0}
            </Text>
          </View>
        </View>
        <View className="w-1/2 p-2">
          <View className="bg-card dark:bg-dark-card rounded-ios shadow-ios p-4">
            <Text className="text-text-secondary dark:text-dark-text-secondary">
              {t("dashboard.lowStockItems")}
            </Text>
            <Text className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              {stats?.lowStockItems || 0}
            </Text>
          </View>
        </View>
        <View className="w-1/2 p-2">
          <View className="bg-card dark:bg-dark-card rounded-ios shadow-ios p-4">
            <Text className="text-text-secondary dark:text-dark-text-secondary">
              {t("dashboard.totalValue")}
            </Text>
            <Text className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              ${stats?.totalValue || 0}
            </Text>
          </View>
        </View>
        <View className="w-1/2 p-2">
          <View className="bg-card dark:bg-dark-card rounded-ios shadow-ios p-4">
            <Text className="text-text-secondary dark:text-dark-text-secondary">
              {t("dashboard.outOfStock")}
            </Text>
            <Text className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              {stats?.outOfStockItems || 0}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="p-4">
        <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">
          {t("dashboard.quickActions")}
        </Text>
        <View className="flex-row flex-wrap">
          <TouchableOpacity
            className="w-1/2 p-2"
            onPress={() => router.push("/products")}
          >
            <View className="bg-card dark:bg-dark-card rounded-ios shadow-ios p-4 items-center">
              <Text className="text-text-primary dark:text-dark-text-primary font-semibold">
                {t("dashboard.viewProducts")}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-1/2 p-2"
            onPress={() => router.push("/products/new")}
          >
            <View className="bg-card dark:bg-dark-card rounded-ios shadow-ios p-4 items-center">
              <Text className="text-text-primary dark:text-dark-text-primary font-semibold">
                {t("dashboard.addProduct")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Products */}
      <View className="p-4">
        <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">
          {t("dashboard.recentProducts")}
        </Text>
        {recentProducts?.items.map((product) => (
          <TouchableOpacity
            key={product.id}
            className="mb-2"
            onPress={() => router.push(`/products/${product.id}`)}
          >
            <View className="bg-card dark:bg-dark-card rounded-ios shadow-ios p-4">
              <Text className="text-text-primary dark:text-dark-text-primary font-semibold">
                {product.name}
              </Text>
              <Text className="text-text-secondary dark:text-dark-text-secondary">
                ${product.price}
              </Text>
              <Text className="text-text-tertiary dark:text-dark-text-tertiary">
                {t("dashboard.stock")}: {product.stock}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
