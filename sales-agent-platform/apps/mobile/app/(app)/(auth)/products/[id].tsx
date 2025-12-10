import { View, Text, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTRPC } from "../../../../utils/trpc";
import { useQuery } from "@tanstack/react-query";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trpc = useTRPC();

  const { data: product, isLoading } = useQuery(
    trpc.product.getById.queryOptions(id)
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-black">Loading...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-black">Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="bg-white rounded-lg shadow-sm p-4 m-4">
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            className="w-full h-64 rounded-lg mb-4"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-64 bg-gray-200 rounded-lg mb-4 items-center justify-center">
            <Text className="text-gray-500">No Image</Text>
          </View>
        )}
        <Text className="text-2xl font-bold text-black mb-2">
          {product.name}
        </Text>
        <Text className="text-3xl font-bold text-black mb-4">
          ${product.price}
        </Text>
        <Text className="text-gray-600 mb-4" numberOfLines={10}>
          {product.description || "No description available"}
        </Text>
        <Text className="text-gray-500">Stock: {product.stock}</Text>
      </View>
    </ScrollView>
  );
}
