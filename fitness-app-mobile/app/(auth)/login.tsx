import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import auth, { signInWithEmailAndPassword, sendPasswordResetEmail } from '../../lib/firebase/firebaseAuth';
import { ensureUserInitialized } from '../../lib/firebase/firebaseFirestore';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../lib/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Missing fields', 'Enter email and password.');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Ensure the user doc exists on first login (parity with web init behavior)
      await ensureUserInitialized();
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Sign in failed', e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    const addr = email.trim();
    if (!addr) return Alert.alert('Enter email', 'Please enter your email to reset your password.');
    try {
      await sendPasswordResetEmail(auth, addr);
      Alert.alert('Password reset', `If ${addr} exists, a reset email has been sent.`);
    } catch (e: any) {
      Alert.alert('Error', e?.message || String(e));
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
            <Text style={styles.title}>Sign In</Text>
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
          <TouchableOpacity onPress={handleForgot} style={styles.forgotLink}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#111827" />
            ) : (
              <Text style={styles.primaryText}>Sign In</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(auth)/register' as any)}>
            <Text style={styles.secondaryText}>Create an account</Text>
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
  forgotLink: { alignSelf: 'flex-end', marginBottom: 12 },
  forgotText: { color: '#e5e7eb', textDecorationLine: 'underline' },
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
