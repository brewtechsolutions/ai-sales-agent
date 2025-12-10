import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTRPC } from "../../../../utils/trpc";
import { useQuery } from "@tanstack/react-query";

export default function ProductsScreen() {
  const { t } = useTranslation();
  const trpc = useTRPC();
  const { data: products, isLoading } = useQuery(
    trpc.product.getAll.queryOptions({
      page: 1,
      pageSize: 10,
    })
  );

  const renderProduct = ({
    item,
  }: {
    item: NonNullable<typeof products>["items"][number];
  }) => (
    <TouchableOpacity
      className="w-1/2 p-2"
      onPress={() => router.push(`/products/${item.id}`)}
    >
      <View className="bg-card dark:bg-dark-card rounded-ios shadow-ios p-4">
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            className="w-full h-40 rounded-ios mb-2"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-40 bg-surface dark:bg-dark-surface rounded-ios mb-2 items-center justify-center">
            <Text className="text-text-tertiary dark:text-dark-text-tertiary">
              {t("dashboard.noImage")}
            </Text>
          </View>
        )}
        <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-1">
          {item.name}
        </Text>
        <Text className="text-text-secondary dark:text-dark-text-secondary mb-2" numberOfLines={2}>
          {item.description || ""}
        </Text>
        <Text className="text-text-primary dark:text-dark-text-primary font-bold">
          ${item.price}
        </Text>
        <Text className="text-text-tertiary dark:text-dark-text-tertiary">
          {t("dashboard.stock")}: {item.stock}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-dark-background items-center justify-center">
        <Text className="text-text-primary dark:text-dark-text-primary">
          {t("common.loading")}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface dark:bg-dark-surface">
      <FlatList
        data={products?.items || []}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
      />
    </View>
  );
}
