import React, { useEffect, useMemo, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal, FlatList, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../lib/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import { Calendar as RNCalendar } from 'react-native-calendars';
import type { DateData } from 'react-native-calendars';
import auth from '../lib/firebase/firebaseAuth';
import { dayDataManager } from '../lib/firebase/dayDataManager';
import { getDocuments } from '../lib/firebase/firebaseFirestore';

type DayData = {
  date: string;
  recipe1Id?: string; recipe2Id?: string; recipe3Id?: string; recipe4Id?: string; recipe5Id?: string;
  exercise1Id?: string; exercise2Id?: string; exercise3Id?: string; exercise4Id?: string; exercise5Id?: string;
};

const recipeKeys = ['recipe1Id','recipe2Id','recipe3Id','recipe4Id','recipe5Id'] as const;
type RecipeKey = typeof recipeKeys[number];
const exerciseKeys = ['exercise1Id','exercise2Id','exercise3Id','exercise4Id','exercise5Id'] as const;
type ExerciseKey = typeof exerciseKeys[number];

export default function CalendarScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string }>();
  const initialIso = params.date ? String(params.date) : new Date().toISOString().split('T')[0];

  const email = auth.currentUser?.email ?? null;
  const [selectedIso, setSelectedIso] = useState(initialIso);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DayData | null>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [recipePickerVisible, setRecipePickerVisible] = useState(false);
  const [exercisePickerVisible, setExercisePickerVisible] = useState(false);
  const [pickSlot, setPickSlot] = useState<number>(1);
  const [allDays, setAllDays] = useState<any[]>([]);
  // Repeat Day state
  const [repeatWeeks, setRepeatWeeks] = useState<number>(1);
  const [repeatFrequency, setRepeatFrequency] = useState<'every' | 'every-other'>('every');
  const [repeatLoading, setRepeatLoading] = useState(false);

  const dateLabel = useMemo(() => new Date(selectedIso).toDateString(), [selectedIso]);
  const today = useMemo(() => {
    const d = new Date(); d.setHours(0,0,0,0); return d;
  }, []);
  const selectedDateObj = useMemo(() => { const d = new Date(selectedIso); d.setHours(0,0,0,0); return d; }, [selectedIso]);
  const repeatDayOfWeek = useMemo(() => new Date(selectedIso).toLocaleDateString('en-US', { weekday: 'long' }), [selectedIso]);
  const repeatStartLabel = useMemo(() => new Date(selectedIso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), [selectedIso]);
  const repeatEndLabel = useMemo(() => {
    const d = new Date(selectedIso);
    d.setDate(d.getDate() + repeatWeeks * 7);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, [selectedIso, repeatWeeks]);

  useEffect(() => {
    if (!email) {
      router.replace('/(auth)/login' as any);
      return;
    }
    // load all day documents for calendar marks
    const loadAllDays = async () => {
      try {
        const docs = await getDocuments(`users/${email}/days`);
        setAllDays(docs);
      } catch (e) {
        // non-fatal
      }
    };
    loadAllDays();
    const load = async () => {
      try {
        setLoading(true);
        const manager = new dayDataManager(email);
        const d = await manager.getDayFromDate(String(selectedIso));
        setData(d as DayData);
      } catch (e) {
        console.error('Error loading day', e);
        Alert.alert('Error', 'Failed to load day');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [email, selectedIso]);

  const refresh = async () => {
    if (!email || !selectedIso) return;
    const manager = new dayDataManager(email);
    const d = await manager.getDayFromDate(String(selectedIso));
    setData(d as DayData);
    // also refresh all days for markers
    try {
      const docs = await getDocuments(`users/${email}/days`);
      setAllDays(docs);
    } catch {}
  };

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

  const refreshAllDays = async () => {
    if (!email) return;
    try {
      const docs = await getDocuments(`users/${email}/days`);
      setAllDays(docs);
    } catch {}
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
    if (!email || !selectedIso) return;
    try {
      const manager = new dayDataManager(email);
      await manager.addRecipeToDay(String(selectedIso), id, pickSlot);
      setRecipePickerVisible(false);
      await refresh();
    } catch (e: any) {
      Alert.alert('Add recipe failed', e?.message || String(e));
    }
  };
  const onSelectExercise = async (id: string) => {
    if (!email || !selectedIso) return;
    try {
      const manager = new dayDataManager(email);
      await manager.addExerciseToDay(String(selectedIso), id, pickSlot);
      setExercisePickerVisible(false);
      await refresh();
    } catch (e: any) {
      Alert.alert('Add exercise failed', e?.message || String(e));
    }
  };

  const onClearRecipe = async (slot: number) => {
    if (!email || !selectedIso) return;
    try {
      const manager = new dayDataManager(email);
      await manager.addRecipeToDay(String(selectedIso), '', slot);
      await refresh();
    } catch (e: any) {
      Alert.alert('Clear recipe failed', e?.message || String(e));
    }
  };

  const onClearExercise = async (slot: number) => {
    if (!email || !selectedIso) return;
    try {
      const manager = new dayDataManager(email);
      await manager.addExerciseToDay(String(selectedIso), '', slot);
      await refresh();
    } catch (e: any) {
      Alert.alert('Clear exercise failed', e?.message || String(e));
    }
  };

  const goPrevDay = () => {
    const d = new Date(selectedIso);
    d.setDate(d.getDate() - 1);
    setSelectedIso(d.toISOString().split('T')[0]);
  };
  const goNextDay = () => {
    const d = new Date(selectedIso);
    d.setDate(d.getDate() + 1);
    setSelectedIso(d.toISOString().split('T')[0]);
  };

  const relLabel = () => {
    const delta = (selectedDateObj.getTime() - today.getTime()) / (1000*60*60*24);
    if (delta <= -1 && Math.abs(delta) < 2) return 'Yesterday';
    if (delta >= 0 && delta < 1) return 'Today';
    if (delta >= 1 && delta < 2) return 'Tomorrow';
    return '';
  };

  const handleRepeatDay = async () => {
    if (!email || !data) return;
    const totalWeeks = repeatWeeks;
    if (!totalWeeks || totalWeeks <= 0) return;

    setRepeatLoading(true);
    try {
      const manager = new dayDataManager(email);
      const recipeIds = (recipeKeys.map(k => (data as any)[k]).filter(Boolean) as string[]);
      const exerciseIds = (exerciseKeys.map(k => (data as any)[k]).filter(Boolean) as string[]);
      const weekOffset = repeatFrequency === 'every' ? 7 : 14;
      const repeatCount = repeatFrequency === 'every' ? totalWeeks : Math.floor(totalWeeks / 2);

      for (let i = 1; i <= repeatCount; i++) {
        const d = new Date(selectedIso);
        d.setDate(d.getDate() + i * weekOffset);
        const iso = d.toISOString().split('T')[0];
        const recipPromises = recipeIds.map((rid, idx) => manager.addRecipeToDay(iso, rid, idx + 1));
        const exercisePromises = exerciseIds.map((eid, idx) => manager.addExerciseToDay(iso, eid, idx + 1));
        await Promise.all([...recipPromises, ...exercisePromises]);
      }

      const msg = `${repeatFrequency === 'every' ? `Every ${repeatDayOfWeek}` : `Every other ${repeatDayOfWeek}`}\nFrom ${repeatDayOfWeek} ${repeatStartLabel} - ${repeatDayOfWeek} ${repeatEndLabel}\nHas Been Set!`;
      Alert.alert('Repeat Set', msg);
      await refreshAllDays();
    } catch (e: any) {
      Alert.alert('Repeat failed', e?.message || String(e));
    } finally {
      setRepeatLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Calendar' }} />
      {loading ? (
        <View style={styles.center}><ActivityIndicator /></View>
      ) : !data ? (
        <View style={styles.center}><Text>No data</Text></View>
      ) : (
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={theme.gradients.screenDarkLightLR.colors as any}
            start={theme.gradients.screenDarkLightLR.start as any}
            end={theme.gradients.screenDarkLightLR.end as any}
            style={StyleSheet.absoluteFill}
          />
          <ScrollView contentContainerStyle={styles.container}>
          {/* Month grid calendar (mobile alternative to FullCalendar) */}
          <View style={[styles.calendarBox, { borderColor: '#000' }]}>
            <LinearGradient
              colors={theme.gradients.calendarPanel.colors as any}
              start={theme.gradients.calendarPanel.start as any}
              end={theme.gradients.calendarPanel.end as any}
              style={[StyleSheet.absoluteFill, { borderRadius: 10 }]}
              pointerEvents="none"
            />
            <RNCalendar
              current={selectedIso}
              onDayPress={(day: DateData) => setSelectedIso(day.dateString)}
              onMonthChange={(m) => {
                // ensure selected stays in sync with month change if needed
              }}
              markedDates={buildMarkedDates(allDays, selectedIso)}
              theme={{
                calendarBackground: '#fff',
                textSectionTitleColor: '#6b7280',
                dayTextColor: '#111827',
                monthTextColor: '#111827',
                arrowColor: '#111827',
                selectedDayBackgroundColor: '#d1d5db',
                selectedDayTextColor: '#111827',
                todayTextColor: '#0ea5e9',
              }}
              firstDay={0}
            />
          </View>
          <View style={{ height: 12 }} />
          {/* Navigation Row like web (arrows + relative labels) */}
          <View style={styles.navRow}>
            <TouchableOpacity onPress={goPrevDay}>
              <FontAwesome5 name="arrow-circle-left" size={36} color="#334155" />
            </TouchableOpacity>
            <Text style={styles.relText}>{relLabel()}</Text>
            <TouchableOpacity onPress={goNextDay}>
              <FontAwesome5 name="arrow-circle-right" size={36} color="#334155" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.dateTitle, { color: '#fff' }]}>{dateLabel}</Text>

          {/* Editor area akin to EditDayComponent (picker-only, no manual inputs) */}
          <View style={[styles.panel, { backgroundColor: '#fff' }]}>
            <Text style={[styles.sectionHeader, { color: '#111827' }]}>Recipes</Text>
            {recipeKeys.map((key, idx) => (
              <Pressable key={key} style={[styles.itemRow, styles.rowBetween, styles.slotCard]} onPress={() => openRecipePicker(idx + 1)}>
                <LinearGradient
                  colors={theme.gradients.recipeCard.colors as any}
                  start={theme.gradients.recipeCard.start as any}
                  end={theme.gradients.recipeCard.end as any}
                  style={[StyleSheet.absoluteFill, { opacity: 0.5, borderRadius: 8 }]} pointerEvents="none"
                />
                <Text>
                  Slot {idx + 1}: {(data as any)[key as RecipeKey] || '-'}
                </Text>
                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.clearBtn} onPress={() => onClearRecipe(idx + 1)}>
                    <Text style={styles.clearBtnText}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            ))}

            <View style={{ height: 24 }} />
            <Text style={[styles.sectionHeader, { color: '#111827' }]}>Exercises</Text>
            {exerciseKeys.map((key, idx) => (
              <Pressable key={key} style={[styles.itemRow, styles.rowBetween, styles.slotCard]} onPress={() => openExercisePicker(idx + 1)}>
                <LinearGradient
                  colors={theme.gradients.exerciseCard.colors as any}
                  start={theme.gradients.exerciseCard.start as any}
                  end={theme.gradients.exerciseCard.end as any}
                  style={[StyleSheet.absoluteFill, { opacity: 0.5, borderRadius: 8 }]} pointerEvents="none"
                />
                <Text>
                  Slot {idx + 1}: {(data as any)[key as ExerciseKey] || '-'}
                </Text>
                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.clearBtn} onPress={() => onClearExercise(idx + 1)}>
                    <Text style={styles.clearBtnText}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            ))}
          </View>

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
              <TouchableOpacity style={[styles.changeBtn, { alignSelf: 'center' }]} onPress={() => setRecipePickerVisible(false)}>
                <Text style={styles.changeBtnText}>Close</Text>
              </TouchableOpacity>
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
              <TouchableOpacity style={[styles.changeBtn, { alignSelf: 'center' }]} onPress={() => setExercisePickerVisible(false)}>
                <Text style={styles.changeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Repeat Day area matching web logic */}
          <View style={[styles.panel, { marginTop: 12, backgroundColor: '#fff' }]}> 
            <Text style={[styles.sectionHeader, { color: '#111827' }]}>Repeat Area</Text>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ marginBottom: 8 }}>Update
                <Text> </Text>
              </Text>
              <View style={styles.segmentRow}>
                <TouchableOpacity
                  onPress={() => setRepeatFrequency('every')}
                  style={[styles.segmentBtn, repeatFrequency === 'every' && styles.segmentBtnActive]}
                >
                  <Text style={[styles.segmentText, repeatFrequency === 'every' && styles.segmentTextActive]}>every</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setRepeatFrequency('every-other')}
                  style={[styles.segmentBtn, repeatFrequency === 'every-other' && styles.segmentBtnActive]}
                >
                  <Text style={[styles.segmentText, repeatFrequency === 'every-other' && styles.segmentTextActive]}>every other</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ marginTop: 6 }}>{repeatDayOfWeek}</Text>

              <View style={{ height: 12 }} />
              <Text>For</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  accessibilityLabel="decrement weeks"
                  onPress={() => setRepeatWeeks(w => Math.max(1, w - 1))}
                  style={styles.stepperBtn}
                >
                  <Text style={styles.stepperBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{repeatWeeks}</Text>
                <TouchableOpacity
                  accessibilityLabel="increment weeks"
                  onPress={() => setRepeatWeeks(w => Math.min(26, w + 1))}
                  style={styles.stepperBtn}
                >
                  <Text style={styles.stepperBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ marginTop: 4 }}>week(s) after selected day</Text>

              <TouchableOpacity style={styles.repeatCta} onPress={handleRepeatDay} disabled={repeatLoading}>
                {!repeatLoading ? (
                  <Text style={styles.repeatCtaText}>Set Repeat</Text>
                ) : (
                  <ActivityIndicator color="#fff" />
                )}
              </TouchableOpacity>

              <FontAwesome5 name="arrow-down" size={24} color="#6b7280" style={{ marginTop: 8 }} />

              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>
                  {repeatDayOfWeek} <Text style={{ fontWeight: '800' }}>{repeatStartLabel}</Text> - {repeatDayOfWeek} <Text style={{ fontWeight: '800' }}>{repeatEndLabel}</Text>{'\n'}
                  {repeatFrequency === 'every' ? ' ( every ' : ' ( every other '}{repeatDayOfWeek})
                </Text>
              </View>
            </View>
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
  calendarBox: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, overflow: 'hidden' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  relText: { fontSize: 18, fontWeight: '600', color: '#374151' },
  dateTitle: { textAlign: 'center', fontSize: 20, fontWeight: '800', marginBottom: 12 },
  panel: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, backgroundColor: '#fff' },
  sectionHeader: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  itemRow: { paddingVertical: 6 },
  slotCard: { position: 'relative', overflow: 'hidden', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  changeBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#1f2937', borderRadius: 6 },
  changeBtnText: { color: 'white', fontWeight: '700' },
  clearBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#e5e7eb', borderRadius: 6, marginRight: 8 },
  clearBtnText: { color: '#111827', fontWeight: '700' },
  pickItem: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#e5e7eb' },
  segmentRow: { flexDirection: 'row', gap: 8 },
  segmentBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#e5e7eb' },
  segmentBtnActive: { backgroundColor: '#111827' },
  segmentText: { color: '#111827', fontWeight: '700' },
  segmentTextActive: { color: '#fff' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  stepperBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  stepperBtnText: { fontSize: 18, fontWeight: '800', color: '#111827' },
  stepperValue: { minWidth: 28, textAlign: 'center', fontSize: 18, fontWeight: '800' },
  repeatCta: { marginTop: 14, backgroundColor: '#6b7280', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24 },
  repeatCtaText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  summaryBox: { marginTop: 10, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 10, backgroundColor: '#f9fafb' },
  summaryText: { color: '#374151', textAlign: 'center' },
});

function buildMarkedDates(days: any[], selectedIso: string) {
  const marks: Record<string, any> = {};
  // mark days that have at least one non-empty slot
  days.forEach((doc) => {
    const id = doc.id as string; // YYYY-MM-DD
    const hasContent =
      !!(doc.recipe1Id || doc.recipe2Id || doc.recipe3Id || doc.recipe4Id || doc.recipe5Id ||
         doc.exercise1Id || doc.exercise2Id || doc.exercise3Id || doc.exercise4Id || doc.exercise5Id);
    if (hasContent) {
      marks[id] = {
        ...(marks[id] || {}),
        marked: true,
        dotColor: '#10b981',
      };
    }
  });
  // ensure selected highlighting is applied
  marks[selectedIso] = {
    ...(marks[selectedIso] || {}),
    selected: true,
    selectedColor: '#d1d5db',
    selectedTextColor: '#111827',
  };
  return marks;
}
