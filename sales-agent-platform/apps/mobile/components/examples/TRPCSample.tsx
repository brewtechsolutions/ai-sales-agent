import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useTRPC } from "../../utils/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Sample tRPC Component
 * 
 * This component demonstrates how to use tRPC from the mobile app to call backend endpoints.
 * It shows both query (GET) and mutation (POST/PUT/DELETE) patterns.
 */
export default function TRPCSample() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // State for creating a new product
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");

  // ✅ Example 1: Query (GET) - Fetching products
  // This automatically handles loading, error, and data states
  const { data: products, isLoading, error } = useQuery(
    trpc.product.getAll.queryOptions({
      page: 1,
      pageSize: 10,
    })
  );

  // ✅ Example 2: Query (GET) - Fetching product stats
  const { data: stats } = useQuery(
    trpc.product.getStats.queryOptions()
  );

  // ✅ Example 3: Mutation (POST) - Creating a product
  const createProductMutation = useMutation(
    trpc.product.create.mutationOptions({
      onSuccess: (data) => {
        // Invalidate and refetch products list after successful creation
        queryClient.invalidateQueries({ queryKey: ["product", "getAll"] });
        queryClient.invalidateQueries({ queryKey: ["product", "getStats"] });
        
        Alert.alert("Success", `Product "${data.name}" created successfully!`);
        
        // Reset form
        setProductName("");
        setProductPrice("");
        setProductStock("");
      },
      onError: (error) => {
        Alert.alert("Error", error.message || "Failed to create product");
      },
    })
  );

  // ✅ Example 4: Mutation (DELETE) - Deleting a product
  const deleteProductMutation = useMutation(
    trpc.product.delete.mutationOptions({
      onSuccess: () => {
        // Invalidate queries to refetch updated data
        queryClient.invalidateQueries({ queryKey: ["product", "getAll"] });
        queryClient.invalidateQueries({ queryKey: ["product", "getStats"] });
        Alert.alert("Success", "Product deleted successfully!");
      },
      onError: (error) => {
        Alert.alert("Error", error.message || "Failed to delete product");
      },
    })
  );

  const handleCreateProduct = () => {
    if (!productName || !productPrice || !productStock) {
      Alert.alert("Validation", "Please fill in all fields");
      return;
    }

    // Call the mutation
    createProductMutation.mutate({
      name: productName,
      description: "Sample product created from mobile app",
      price: parseFloat(productPrice),
      stock: parseInt(productStock, 10),
      userId: "sample-user-id", // In real app, get from auth context
    });
  };

  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteProductMutation.mutate(productId),
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-background dark:bg-dark-background">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
            tRPC Sample Component
          </Text>
          <Text className="text-text-secondary dark:text-dark-text-secondary">
            Demonstrates query and mutation patterns
          </Text>
        </View>

        {/* Stats Section - Example Query */}
        {stats && (
          <View className="bg-card dark:bg-dark-card rounded-ios shadow-ios p-4 mb-4">
            <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">
              Product Statistics
            </Text>
            <Text className="text-text-secondary dark:text-dark-text-secondary">
              Total Products: {stats.totalProducts}
            </Text>
            <Text className="text-text-secondary dark:text-dark-text-secondary">
              Low Stock: {stats.lowStockItems}
            </Text>
            <Text className="text-text-secondary dark:text-dark-text-secondary">
              Total Value: ${stats.totalValue}
            </Text>
          </View>
        )}

        {/* Create Product Form - Example Mutation */}
        <View className="bg-card dark:bg-dark-card rounded-ios shadow-ios p-4 mb-4">
          <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-4">
            Create Product (Mutation Example)
          </Text>

          <TextInput
            className="bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text-primary rounded-ios p-3 mb-3 border border-border dark:border-dark-border"
            placeholder="Product Name"
            placeholderTextColor="#9ca3af"
            value={productName}
            onChangeText={setProductName}
          />

          <TextInput
            className="bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text-primary rounded-ios p-3 mb-3 border border-border dark:border-dark-border"
            placeholder="Price"
            placeholderTextColor="#9ca3af"
            value={productPrice}
            onChangeText={setProductPrice}
            keyboardType="decimal-pad"
          />

          <TextInput
            className="bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text-primary rounded-ios p-3 mb-3 border border-border dark:border-dark-border"
            placeholder="Stock"
            placeholderTextColor="#9ca3af"
            value={productStock}
            onChangeText={setProductStock}
            keyboardType="number-pad"
          />

          <TouchableOpacity
            className="bg-primary rounded-ios p-4 items-center"
            onPress={handleCreateProduct}
            disabled={createProductMutation.isPending}
          >
            <Text className="text-white font-semibold">
              {createProductMutation.isPending ? "Creating..." : "Create Product"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Products List - Example Query */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">
            Products List (Query Example)
          </Text>

          {isLoading && (
            <View className="bg-card dark:bg-dark-card rounded-ios shadow-ios p-4">
              <Text className="text-text-secondary dark:text-dark-text-secondary">
                Loading products...
              </Text>
            </View>
          )}

          {error && (
            <View className="bg-error-light dark:bg-error-dark rounded-ios shadow-ios p-4 mb-2">
              <Text className="text-error dark:text-error">
                Error: {error.message}
              </Text>
            </View>
          )}

          {products?.items && products.items.length > 0 ? (
            products.items.map((product) => (
              <View
                key={product.id}
                className="bg-card dark:bg-dark-card rounded-ios shadow-ios p-4 mb-2"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-1">
                      {product.name}
                    </Text>
                    <Text className="text-text-secondary dark:text-dark-text-secondary mb-1">
                      ${product.price}
                    </Text>
                    <Text className="text-text-tertiary dark:text-dark-text-tertiary">
                      Stock: {product.stock}
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="bg-error rounded-ios px-3 py-2 ml-2"
                    onPress={() => handleDeleteProduct(product.id)}
                    disabled={deleteProductMutation.isPending}
                  >
                    <Text className="text-white text-sm">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            !isLoading && (
              <View className="bg-card dark:bg-dark-card rounded-ios shadow-ios p-4">
                <Text className="text-text-secondary dark:text-dark-text-secondary">
                  No products found
                </Text>
              </View>
            )
          )}
        </View>

        {/* Code Examples Section */}
        <View className="bg-card dark:bg-dark-card rounded-ios shadow-ios p-4">
          <Text className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">
            Code Examples
          </Text>

          <Text className="text-sm font-mono text-text-secondary dark:text-dark-text-secondary mb-2">
            {/* Query Example */}
            {`// Query Example
const { data, isLoading } = useQuery(
  trpc.product.getAll.queryOptions({
    page: 1,
    pageSize: 10,
  })
);`}
          </Text>

          <Text className="text-sm font-mono text-text-secondary dark:text-dark-text-secondary mt-4">
            {/* Mutation Example */}
            {`// Mutation Example
const mutation = useMutation(
  trpc.product.create.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["product", "getAll"] 
      });
    },
  })
);

mutation.mutate({ name, price, stock });`}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

