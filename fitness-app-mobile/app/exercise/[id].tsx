import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../lib/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import auth from '../../lib/firebase/firebaseAuth';
import db, { deleteDocument as deleteUserDoc } from '../../lib/firebase/firebaseFirestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import aiRevampGemini from '../../hooks/geminiAiRevamp';

export default function ExerciseEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const exerciseId = String(id || '');
  const email = auth.currentUser?.email ?? null;

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [instructions, setInstructions] = useState('');
  const [revamping, setRevamping] = useState(false);
  const [aiNotes, setAiNotes] = useState('');

  useEffect(() => {
    if (!email) {
      router.replace('/(auth)/login' as any);
      return;
    }
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

  const onUpdate = async () => {
    try {
      if (!email) return;
      const ref = doc(db, 'users', email, 'exercises', exerciseId);
      await setDoc(ref, { name, muscleGroup, instructions }, { merge: true });
      Alert.alert('Updated', 'Exercise updated', [
        { text: 'OK', onPress: () => router.replace('/' as any) }
      ]);
    } catch (e: any) {
      Alert.alert('Save failed', e?.message || String(e));
    }
  };
  const onSaveAsNew = async () => {
    try {
      if (!email) return;
      const newId = (name || '').trim();
      if (!newId) { Alert.alert('Validation', 'Name cannot be empty.'); return; }
      const ref = doc(db, 'users', email, 'exercises', newId);
      await setDoc(ref, { name: newId, muscleGroup, instructions }, { merge: true });
      Alert.alert('Saved', `Saved ${newId} as a new card`, [
        { text: 'OK', onPress: () => router.replace('/' as any) }
      ]);
    } catch (e: any) {
      Alert.alert('Save failed', e?.message || String(e));
    }
  };
  const onDelete = async () => {
    try {
      if (!email) return;
      Alert.alert('Delete Forever?', `Delete ${name}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          // Match web behavior: delete by card name under user's exercises
          await deleteUserDoc('exercises', name);
          Alert.alert('Deleted', `${name} removed`);
          // Navigate to Home to match requested flow and refresh
          router.replace('/' as any);
        }}
      ]);
    } catch (e: any) {
      Alert.alert('Delete failed', e?.message || String(e));
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Edit Exercise' }} />
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
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Cancel */}
          <View style={styles.rowEnd}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
              <Text style={styles.cancelText}>cancel</Text>
              <FontAwesome5 name="times" size={18} color="#fff" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>

          <Text style={styles.editingTitle}>Editing "{name}"</Text>

          {/* Name */}
          <TextInput
            style={[styles.input, styles.nameInput, styles.darkInput]}
            value={name}
            onChangeText={setName}
            placeholder="Name"
            multiline
          />

          {/* Muscle Group */}
          <Text style={[styles.sectionTitle, { color: '#e285f4' }]}>Muscle Group</Text>
          <TextInput
            style={[styles.input, styles.multiInput, styles.darkInput]}
            value={muscleGroup}
            onChangeText={setMuscleGroup}
            placeholder="e.g., Chest, Legs..."
            multiline
          />

          {/* Instructions */}
          <Text style={[styles.sectionTitle, { color: '#e285f4' }]}>Instructions</Text>
          <TextInput
            style={[styles.input, styles.multiInput, styles.darkInput]}
            value={instructions}
            onChangeText={setInstructions}
            placeholder="Steps..."
            multiline
          />

          <View style={styles.actionRow}>
            {exerciseId !== 'NewItem' && (
              <TouchableOpacity style={styles.actionBtn} onPress={onUpdate}>
                <FontAwesome5 name="check" size={18} color="#000" style={{ marginRight: 8 }} />
                <Text style={styles.actionText}>Update this card</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionBtn} onPress={onSaveAsNew}>
              <FontAwesome5 name="plus" size={18} color="#000" style={{ marginRight: 8 }} />
              <Text style={styles.actionText}>Save as new</Text>
            </TouchableOpacity>
          </View>

          {/* AI Revamp */}
          <View style={styles.aiBox}>
            <FontAwesome5 name="robot" size={18} color="#111827" style={{ marginBottom: 6, alignSelf: 'center' }} />
            <Text style={{ textAlign: 'center', marginBottom: 8 }}>Ai Revamp</Text>
              <TextInput
                style={[styles.input, { minHeight: 80, marginBottom: 8 }]}
                value={aiNotes}
                onChangeText={setAiNotes}
                placeholder="Optional: add specific details for the revamp (allowed to be empty)"
                multiline
              />
            <TouchableOpacity
              disabled={revamping}
              style={[styles.actionBtn, { alignSelf: 'center', opacity: revamping ? 0.6 : 1 }]}
              onPress={async () => {
                try {
                  if (!name.trim()) { Alert.alert('Validation', 'Name cannot be empty.'); return; }
                  setRevamping(true);
                    const content = `(name: ${name})\n${muscleGroup}\n${instructions}`;
                    const ai = await aiRevampGemini('exercise', content, aiNotes);
                  const g1 = Array.isArray(ai.group_one) ? ai.group_one : [];
                  const g2 = Array.isArray(ai.group_two) ? ai.group_two : [];
                  setMuscleGroup(g1.join('\n'));
                  setInstructions(g2.join('\n'));
                  try { Alert.alert('AI filled', `${g1.length} muscle group lines, ${g2.length} instruction lines`); } catch {}
                } catch (e: any) {
                  Alert.alert('AI Revamp failed', e?.message || String(e));
                } finally {
                  setRevamping(false);
                }
              }}>
              <Text style={styles.actionText}>{revamping ? 'Revamping…' : 'Revamp with AI'}</Text>
            </TouchableOpacity>
          </View>

          {exerciseId !== 'NewItem' && (
            <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
              <FontAwesome5 name="trash" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.deleteText}>Delete Forever?</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
        </KeyboardAvoidingView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, paddingTop: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  rowEnd: { flexDirection: 'row', justifyContent: 'flex-end' },
  cancelBtn: { backgroundColor: '#6b7280', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  cancelText: { color: '#fff' },
  editingTitle: { textAlign: 'center', fontSize: 20, fontWeight: '800', marginVertical: 16 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12 },
  darkInput: { backgroundColor: '#222222DD', color: 'wheat', borderWidth: 5, borderColor: '#ccc' },
  nameInput: { fontSize: 22, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  multiInput: { minHeight: 140, textAlignVertical: 'top' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 24 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 16, backgroundColor: '#fff', minWidth: '40%', justifyContent: 'center' },
  actionText: { fontSize: 16, fontWeight: '700' },
  aiBox: { marginTop: 16, padding: 12, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, backgroundColor: 'rgba(243,244,246,0.5)' },
  deleteBtn: { marginTop: 48, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: '#dc2626', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 10 },
  deleteText: { color: '#fff', fontWeight: '700' },
});
