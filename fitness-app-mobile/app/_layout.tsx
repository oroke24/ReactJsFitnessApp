import React from "react";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function RootLayout() {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerBackTitle: '',
        headerStyle: { backgroundColor: '#1f2937' },
        headerTitleStyle: { color: '#fff' },
        headerTintColor: '#fff',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={{ paddingHorizontal: 12, paddingVertical: 8 }}
          >
            <FontAwesome5 name="chevron-left" size={18} color="#fff" />
          </TouchableOpacity>
        ),
      }}
    >
      {/* Hide the parent header for the tabs group so it doesn't show "(tabs)" */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Hide the parent header for the auth group so it doesn't show "(auth)" */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
