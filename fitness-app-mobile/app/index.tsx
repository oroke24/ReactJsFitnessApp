import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import useAuthStatus from "../hooks/useAuthStatus";

export default function Index() {
  const { user, authLoading } = useAuthStatus();
  if (authLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  if (!user) return <Redirect href={"/(auth)/login" as any} />;
  return <Redirect href="/(tabs)" />;
}
