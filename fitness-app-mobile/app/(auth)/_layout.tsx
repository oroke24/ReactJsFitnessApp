import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function AuthLayout() {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1f2937' },
        headerTitleStyle: { color: '#fff' },
        headerTintColor: '#fff',
        headerTitle: '',
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
      <Stack.Screen name="login" options={{ headerShown: true }} />
      <Stack.Screen name="register" options={{ headerShown: true }} />
    </Stack>
  );
}
