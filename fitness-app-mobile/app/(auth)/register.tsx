import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import auth, { createUserWithEmailAndPassword, sendEmailVerification, signOut } from '../../lib/firebase/firebaseAuth';
import { initializeUser } from '../../lib/firebase/firebaseFirestore';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../lib/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) return Alert.alert('Missing fields', 'Enter email and password.');
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      await sendEmailVerification(auth.currentUser!);
      // Populate the new account with guest content, like the web version
      await initializeUser();
      Alert.alert('Verify your email', `A verification link was sent to ${email}. Check spam/junk if needed.`);
      await signOut(auth);
      router.replace('/(auth)/login' as any);
    } catch (e: any) {
      Alert.alert('Registration failed', e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={theme.gradients.screenDarkLightLR.colors as any}
        start={theme.gradients.screenDarkLightLR.start as any}
        end={theme.gradients.screenDarkLightLR.end as any}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.centerZone}>
            <View style={styles.panel}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#111827" />
            ) : (
              <Text style={styles.primaryText}>Create</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.replace('/(auth)/login' as any)}>
            <Text style={styles.secondaryText}>Back to Sign In</Text>
          </TouchableOpacity>
            </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 64 },
  scrollContainer: { flexGrow: 1 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 16, color: '#fff', textAlign: 'center' },
  panel: {
    backgroundColor: '#11111177',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
  },
  centerZone: { flex: 1, justifyContent: 'center' },
  label: { color: '#e5e7eb', fontWeight: '700', marginBottom: 6 },
  input: {
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#1f2937',
    color: '#f5deb3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryText: { color: '#111827', fontWeight: '800' },
  secondaryBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryText: { color: '#e5e7eb', fontWeight: '800' },
});
