import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import auth, { signOut, deleteAccount } from '../../lib/firebase/firebaseAuth';
import { deleteUser as deleteUserData } from '../../lib/firebase/firebaseFirestore';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../lib/theme';

export default function AccountTab() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const email = auth.currentUser?.email ?? 'Guest';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/login' as any);
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const confirmDelete = () => {
    if (!auth.currentUser?.email) return;
    Alert.alert(
      'Danger Zone',
      'Delete account forever?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDelete },
      ]
    );
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteUserData();
      await deleteAccount();
      await signOut(auth);
      router.replace('/(auth)/login' as any);
    } catch (e) {
      console.error('Delete account failed', e);
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
      <View style={styles.container}>
        <Text style={styles.title}>Account</Text>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Signed in as</Text>
          <Text style={styles.emailText}>{email}</Text>
          {process.env.EXPO_PUBLIC_PRIVACY_URL ? (
            <TouchableOpacity style={styles.linkBtn} onPress={() => Linking.openURL(String(process.env.EXPO_PUBLIC_PRIVACY_URL))}>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
          ) : null}
          {auth.currentUser?.email ? (
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} disabled={loading}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {auth.currentUser?.email ? (
          <View style={styles.dangerBox}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete} disabled={loading}>
              <Text style={styles.deleteText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 16, color: '#fff', textAlign: 'center' },
  panel: {
    backgroundColor: '#11111177',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
  },
  panelTitle: { color: '#e5e7eb', fontWeight: '700', marginBottom: 6 },
  emailText: { color: '#fff', fontSize: 16, marginBottom: 10 },
  logoutBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  logoutText: { color: '#111827', fontWeight: '800' },
  linkBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  linkText: { color: '#fff', fontWeight: '800' },
  dangerBox: {
    marginTop: 'auto',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)', // faded red
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 16,
  },
  dangerTitle: { color: '#ef4444', fontWeight: '800', fontSize: 22, marginBottom: 12, textAlign: 'center' },
  deleteBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  deleteText: { color: '#fff', fontWeight: '800' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000066',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
