import React, { useEffect, useMemo, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Button, Alert, ScrollView, Modal, FlatList, Pressable } from 'react-native';
import auth from '../../lib/firebase/firebaseAuth';
import { dayDataManager } from '../../lib/firebase/dayDataManager';
import { getDocuments } from '../../lib/firebase/firebaseFirestore';

type DayData = {
  date: string;
  recipe1Id?: string;
  recipe2Id?: string;
  recipe3Id?: string;
  recipe4Id?: string;
  recipe5Id?: string;
  exercise1Id?: string;
  exercise2Id?: string;
  exercise3Id?: string;
  exercise4Id?: string;
  exercise5Id?: string;
};

const recipeKeys = ['recipe1Id','recipe2Id','recipe3Id','recipe4Id','recipe5Id'] as const;
type RecipeKey = typeof recipeKeys[number];
const exerciseKeys = ['exercise1Id','exercise2Id','exercise3Id','exercise4Id','exercise5Id'] as const;
type ExerciseKey = typeof exerciseKeys[number];

export default function DayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string }>();
  const dateParam = params.date ?? '';

  const email = auth.currentUser?.email ?? null;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DayData | null>(null);
  const [addRecipeId, setAddRecipeId] = useState('');
  const [addRecipeSlot, setAddRecipeSlot] = useState('1');
  const [addExerciseId, setAddExerciseId] = useState('');
  const [addExerciseSlot, setAddExerciseSlot] = useState('1');

  // Pickers
  const [recipePickerVisible, setRecipePickerVisible] = useState(false);
  const [exercisePickerVisible, setExercisePickerVisible] = useState(false);
  const [pickSlot, setPickSlot] = useState<number>(1);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);

  const headerTitle = useMemo(() => `Day: ${dateParam}`, [dateParam]);

  useEffect(() => {
    if (!email) {
      RouterToLogin();
      return;
    }
    if (!dateParam) return;

    const load = async () => {
      try {
        const manager = new dayDataManager(email);
        const d = await manager.getDayFromDate(String(dateParam));
        setData(d as DayData);
      } catch (e) {
        console.error('Error loading day', e);
        Alert.alert('Error', 'Failed to load day');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [email, dateParam]);

  const RouterToLogin = () => {
    router.replace('/(auth)/login' as any);
  };

  const refresh = async () => {
    if (!email || !dateParam) return;
    const manager = new dayDataManager(email);
    const d = await manager.getDayFromDate(String(dateParam));
    setData(d as DayData);
  };

  const onAddRecipe = async () => {
    if (!email || !dateParam || !addRecipeId) return;
    try {
      const manager = new dayDataManager(email);
      await manager.addRecipeToDay(String(dateParam), addRecipeId.trim(), Math.max(1, Math.min(5, Number(addRecipeSlot) || 1)));
      setAddRecipeId('');
      await refresh();
    } catch (e: any) {
      Alert.alert('Add recipe failed', e?.message || String(e));
    }
  };

  const onAddExercise = async () => {
    if (!email || !dateParam || !addExerciseId) return;
    try {
      const manager = new dayDataManager(email);
      await manager.addExerciseToDay(String(dateParam), addExerciseId.trim(), Math.max(1, Math.min(5, Number(addExerciseSlot) || 1)));
      setAddExerciseId('');
      await refresh();
    } catch (e: any) {
      Alert.alert('Add exercise failed', e?.message || String(e));
    }
  };

  // Open pickers and load lists
  const openRecipePicker = async (slot: number) => {
    if (!email) return;
    setPickSlot(slot);
    try {
      const list = await getDocuments(`users/${email}/recipes`);
      setRecipes(list);
      setRecipePickerVisible(true);
    } catch (e) {
      Alert.alert('Error', 'Failed to load recipes');
    }
  };
  const openExercisePicker = async (slot: number) => {
    if (!email) return;
    setPickSlot(slot);
    try {
      const list = await getDocuments(`users/${email}/exercises`);
      setExercises(list);
      setExercisePickerVisible(true);
    } catch (e) {
      Alert.alert('Error', 'Failed to load exercises');
    }
  };

  const onSelectRecipe = async (id: string) => {
    if (!email || !dateParam) return;
    try {
      const manager = new dayDataManager(email);
      await manager.addRecipeToDay(String(dateParam), id, pickSlot);
      setRecipePickerVisible(false);
      await refresh();
    } catch (e: any) {
      Alert.alert('Add recipe failed', e?.message || String(e));
    }
  };
  const onSelectExercise = async (id: string) => {
    if (!email || !dateParam) return;
    try {
      const manager = new dayDataManager(email);
      await manager.addExerciseToDay(String(dateParam), id, pickSlot);
      setExercisePickerVisible(false);
      await refresh();
    } catch (e: any) {
      Alert.alert('Add exercise failed', e?.message || String(e));
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: headerTitle }} />
      {loading ? (
        <View style={styles.center}> 
          <ActivityIndicator />
        </View>
      ) : !data ? (
        <View style={styles.center}>
          <Text>No data</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.sectionHeader}>Recipes</Text>
          {recipeKeys.map((key, idx) => (
            <View key={key} style={[styles.itemRow, styles.rowBetween]}>
              <Text>
                Slot {idx + 1}: {data[key as RecipeKey] || '-'}
              </Text>
              <Button title="Change" onPress={() => openRecipePicker(idx + 1)} />
            </View>
          ))}

          {/* Manual recipe entry removed to match web calendar behavior */}

          <View style={{ height: 24 }} />
          <Text style={styles.sectionHeader}>Exercises</Text>
          {exerciseKeys.map((key, idx) => (
            <View key={key} style={[styles.itemRow, styles.rowBetween]}>
              <Text>
                Slot {idx + 1}: {data[key as ExerciseKey] || '-'}
              </Text>
              <Button title="Change" onPress={() => openExercisePicker(idx + 1)} />
            </View>
          ))}

          {/* Pickers */}
          <Modal visible={recipePickerVisible} animationType="slide" onRequestClose={() => setRecipePickerVisible(false)}>
            <View style={{ flex: 1, padding: 16, paddingTop: 48 }}>
              <Text style={styles.sectionHeader}>Pick Recipe (slot {pickSlot})</Text>
              <FlatList
                data={recipes}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <Pressable onPress={() => onSelectRecipe(item.id)} style={styles.pickItem}>
                    <Text style={{ fontSize: 16 }}>{item.name || item.id}</Text>
                  </Pressable>
                )}
              />
              <View style={{ height: 8 }} />
              <Button title="Close" onPress={() => setRecipePickerVisible(false)} />
            </View>
          </Modal>

          <Modal visible={exercisePickerVisible} animationType="slide" onRequestClose={() => setExercisePickerVisible(false)}>
            <View style={{ flex: 1, padding: 16, paddingTop: 48 }}>
              <Text style={styles.sectionHeader}>Pick Exercise (slot {pickSlot})</Text>
              <FlatList
                data={exercises}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <Pressable onPress={() => onSelectExercise(item.id)} style={styles.pickItem}>
                    <Text style={{ fontSize: 16 }}>{item.name || item.id}</Text>
                  </Pressable>
                )}
              />
              <View style={{ height: 8 }} />
              <Button title="Close" onPress={() => setExercisePickerVisible(false)} />
            </View>
          </Modal>
          {/* Manual exercise entry removed to match web calendar behavior */}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, paddingTop: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  itemRow: { paddingVertical: 6, fontSize: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pickItem: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
});
