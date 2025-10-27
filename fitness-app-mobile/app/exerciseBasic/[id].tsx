import React, { useEffect, useState, useRef } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../lib/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import auth from '../../lib/firebase/firebaseAuth';
import db from '../../lib/firebase/firebaseFirestore';
import { doc, getDoc } from 'firebase/firestore';

export default function ExerciseBasicScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const exerciseId = String(id || '');
  const email = auth.currentUser?.email ?? null;

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [instructions, setInstructions] = useState('');
  const cardRef = useRef<View | null>(null);

  useEffect(() => {
    if (!email) { router.replace('/(auth)/login' as any); return; }
    const load = async () => {
      try {
        const ref = doc(db, 'users', email!, 'exercises', exerciseId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          setName(data.name || exerciseId);
          setMuscleGroup(data.muscleGroup || '');
          setInstructions(data.instructions || data.description || '');
        } else {
          setName(exerciseId);
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to load exercise');
      } finally {
        setLoading(false);
      }
    };
    if (exerciseId) load();
  }, [email, exerciseId]);

  return (
    <>
      <Stack.Screen options={{ title: 'Exercise' }} />
      {loading ? (
        <View style={styles.center}><ActivityIndicator /></View>
      ) : (
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={theme.gradients.screenDarkLightLR.colors as any}
            start={theme.gradients.screenDarkLightLR.start as any}
            end={theme.gradients.screenDarkLightLR.end as any}
            style={StyleSheet.absoluteFill}
          />
          <ScrollView contentContainerStyle={styles.container}>
          <View style={[styles.cardOuter, { borderColor: 'indigo' }]} ref={cardRef} collapsable={false}>
            <LinearGradient
              colors={theme.gradients.exerciseCard.colors as any}
              start={theme.gradients.exerciseCard.start as any}
              end={theme.gradients.exerciseCard.end as any}
              style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
              pointerEvents="none"
            />
            <View style={styles.cardInner}>
              <Text style={[styles.title, { color: '#ffffff' }]} selectable selectionColor="#ffffff99">{name}</Text>
            {muscleGroup ? (<>
              <Text style={[styles.sectionTitle, { color: '#e285f4' }]}>Muscle Group</Text>
              <Text style={[styles.bodyText, { color: '#ffffff' }]} selectable selectionColor="#ffffff99">{String(muscleGroup)}</Text>
            </>) : null}
            {instructions ? (<>
              <Text style={[styles.sectionTitle, { color: '#e285f4', marginTop: 8 }]}>Instructions</Text>
              <Text style={[styles.bodyText, { color: '#ffffff' }]} selectable selectionColor="#ffffff99">{String(instructions)}</Text>
            </>) : null}
            </View>
          </View>

          <TouchableOpacity style={styles.editBtn} onPress={() => router.push((`/exercise/${encodeURIComponent(exerciseId)}`) as any)}>
            <FontAwesome5 name="edit" size={16} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          {/* Quick actions like web: Copy text + Save card */}
          <View style={styles.quickRow}>
            <TouchableOpacity
              style={[styles.quickBtn, { backgroundColor: '#111827' }]}
              onPress={async () => {
                try {
                  const text = `${name}\n\nMuscle Group:\n${muscleGroup}\n\nInstructions:\n${instructions}`;
                  await Clipboard.setStringAsync(text);
                  Alert.alert('Copied', 'Card text copied to clipboard');
                } catch (e: any) {
                  Alert.alert('Copy failed', e?.message || String(e));
                }
              }}
            >
              <FontAwesome5 name="copy" size={16} color="#fff" style={{ marginRight: 8 }} />
              <Text style={[styles.quickText, { color: '#fff' }]}>Copy text</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickBtn, { backgroundColor: '#111827' }]}
              onPress={async () => {
                try {
                  if (!cardRef.current) { Alert.alert('Share failed', 'Card not ready to capture'); return; }
                  const uri = await captureRef(cardRef, { format: 'png', quality: 1, result: 'tmpfile' } as any);
                  const available = await Sharing.isAvailableAsync();
                  if (!available) { Alert.alert('Share not available', 'Sharing is not available on this device.'); return; }
                  await Sharing.shareAsync(uri as any, { mimeType: 'image/png', dialogTitle: name });
                } catch (e: any) {
                  Alert.alert('Share failed', e?.message || String(e));
                }
              }}
            >
              <FontAwesome5 name="share-alt" size={16} color="#fff" style={{ marginRight: 8 }} />
              <Text style={[styles.quickText, { color: '#fff' }]}>Share card</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, paddingTop: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cardOuter: { borderWidth: 4, borderRadius: 20, overflow: 'hidden', minHeight: 260, backgroundColor: 'indigo' },
  cardInner: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  bodyText: { color: '#ffffff', lineHeight: 20 },
  editBtn: { marginTop: 16, marginBottom: 16, alignSelf: 'center', width: '80%', backgroundColor: '#111827', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  editText: { color: '#fff', fontWeight: '700' },
  quickRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-evenly' },
  quickBtn: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, flexDirection: 'row', alignItems: 'center' },
  quickText: { fontWeight: '700' },
});
