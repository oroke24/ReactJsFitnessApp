import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function TabsLayout() {
  const router = useRouter();
  return (
    <Tabs
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
        // Hide the footer (tab bar) globally
        tabBarActiveTintColor: '#111827',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: { display: 'none', height: 0 },
        tabBarItemStyle: { height: 0 },
        tabBarLabelStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          // Hide the header entirely on Home
          headerShown: false,
        }}
      />
      <Tabs.Screen name="recipes" options={{ title: '' }} />
      <Tabs.Screen name="exercises" options={{ title: '' }} />
      <Tabs.Screen name="account" options={{ title: '' }} />
    </Tabs>
  );
}
