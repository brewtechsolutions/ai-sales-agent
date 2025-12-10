import { View, Text, TouchableOpacity } from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "../../../../components/common/Button";
import { useTRPC } from "../../../../utils/trpc";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function ProfileScreen() {
  const trpc = useTRPC();
  const { data: user, isLoading } = useQuery(
    trpc.user.getById.queryOptions("")
  );

  const logoutMutation = useMutation(trpc.auth.logout.mutationOptions());

  const handleLogout = async () => {
    try {
      await auth().signOut();
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        console.log('Google sign out failed:', e);
      }
      
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          router.replace("/login");
        },
        onError: (error) => {
          // Even if backend logout fails, we should redirect to login
          router.replace("/login");
        },
      });
    } catch (error) {
      console.error('Logout failed:', error);
      router.replace("/login");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-black">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-6">
      <View className="items-center mb-8">
        <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-4">
          <MaterialIcons name="person" size={48} color="gray" />
        </View>
        <Text className="text-2xl font-bold text-black">{user?.name}</Text>
        <Text className="text-gray-600">{user?.email}</Text>
      </View>

      <View className="space-y-4">
        <View className="bg-gray-100 p-4 rounded-lg">
          <Text className="text-gray-600 mb-2">Account Information</Text>
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="email" size={20} color="gray" />
            <Text className="text-black ml-2">{user?.email}</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons name="person" size={20} color="gray" />
            <Text className="text-black ml-2">{user?.name}</Text>
          </View>
        </View>

        <Button
          title="Logout"
          onPress={handleLogout}
          loading={logoutMutation.isPending}
          variant="outline"
        />
      </View>
    </View>
  );
}
