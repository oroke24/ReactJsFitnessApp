import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Logo from '../../assets/images/layer-group-solid.svg';
import { FontAwesome5 } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../lib/theme';
import auth from '../../lib/firebase/firebaseAuth';
import useWeeklyData from '../../hooks/useWeeklyData';
import { getDocuments } from '../../lib/firebase/firebaseFirestore';

export default function HomeTab() {
  const router = useRouter();
  const email = auth.currentUser?.email ?? null;
  const [today] = useState(new Date());
  const days = useWeeklyData(today, email ?? undefined);

  const isLoggedIn = !!email;
  const weekLabel = useMemo(() => today.toDateString(), [today]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoadingLists(true);
        const user = auth.currentUser?.email;
        const recipePath = user ? `users/${user}/recipes` : 'users/guest/recipes';
        const exercisePath = user ? `users/${user}/exercises` : 'users/guest/exercises';
        const [r, e] = await Promise.all([
          getDocuments(recipePath),
          getDocuments(exercisePath),
        ]);
        if (!mounted) return;
        const sortCaseInsensitive = (arr: any[]) =>
          [...arr].sort((a: any, b: any) => {
            const an = String(a?.name ?? a?.id ?? '').toLowerCase();
            const bn = String(b?.name ?? b?.id ?? '').toLowerCase();
            return an.localeCompare(bn);
          });
        setRecipes(sortCaseInsensitive(r));
        setExercises(sortCaseInsensitive(e));
      } catch (e) {
        // non-fatal on home
      } finally {
        if (mounted) setLoadingLists(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [email]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
          headerStyle: { backgroundColor: '#1f2937' },
          headerShadowVisible: false,
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '800', color: '#fff' },
        }}
      />
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={theme.gradients.screenDarkLightLR.colors as any}
          start={theme.gradients.screenDarkLightLR.start as any}
          end={theme.gradients.screenDarkLightLR.end as any}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.titleRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.title}>Fit Cards</Text>
              <Logo width={28} height={28} style={{ marginLeft: 8 }} />
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Account"
              onPress={() => router.push('/account' as any)}
              style={styles.accountBtn}
              activeOpacity={0.8}
            >
              <FontAwesome5 name="user" size={16} color="#111827" />
            </TouchableOpacity>
          </View>
      <View style={styles.section}>
          <Text style={styles.subtitle}>7 Day Snapshot</Text>
      {!isLoggedIn ? (
        <View>
          <Text style={{ color: '#666', marginBottom: 12 }}>Sign in to see your weekly snapshot.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
            {Array.from({ length: 7 }).map((_, idx) => (
              <View key={idx} style={styles.skeletonCard} />
            ))}
          </ScrollView>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
          {days.map((d, idx) => {
            const dateObj = new Date(d.date);
            // match web component date display (+1 day to offset TZ serialization)
            dateObj.setDate(dateObj.getDate() + 1);
            const label = dateObj.toDateString();
            return (
              <TouchableOpacity
                key={d.date}
                onPress={() => router.push((`/calendar?date=${encodeURIComponent(d.date)}`) as any)}
                activeOpacity={0.8}
              >
                <View style={styles.dayRect}>
                  <Text style={styles.cardHeader}>{idx === 0 ? 'Today' : label}</Text>
                  {d.exercises.length === 0 && d.recipes.length === 0 ? (
                    <View style={[styles.restBody]}>
                      <Text style={styles.restTitle}>Rest Day..{"\n"}Enjoy!</Text>
                      <FontAwesome5 name="sun" size={44} color="#f59e0b" style={{ marginTop: 8 }} />
                      <View style={styles.cloudRow}>
                        <FontAwesome5 name="cloud" size={32} color="#ffffff" style={{ marginTop: 6 }} />
                        <FontAwesome5 name="cloud" size={32} color="#ffffff" style={{ marginTop: 18 }} />
                        <FontAwesome5 name="cloud" size={32} color="#ffffff" style={{ marginTop: 6 }} />
                        <FontAwesome5 name="cloud" size={32} color="#ffffff" style={{ marginTop: 18 }} />
                      </View>
                    </View>
                  ) : (
                    <View style={styles.cardBody}>
                      <View style={styles.col}>
                        <View style={styles.colHeaderRow}>
                          <Text style={[styles.colHeader, { color: '#e285f4' }]}>Exercises</Text>
                          <FontAwesome5 name="walking" size={16} color="#e285f4" />
                        </View>
                        {d.exercises.length === 0 ? (
                          <View style={styles.placeholderCol}>
                            <FontAwesome5 name="skiing-nordic" size={28} color="#ffffff" style={{ marginTop: 10 }} />
                            <FontAwesome5 name="skiing" size={28} color="#ffffff" style={{ marginTop: 18 }} />
                          </View>
                        ) : (
                          <View style={{ marginTop: 6 }}>
                            {d.exercises.slice(0, 5).map((e, i) => (
                              <Text style={[styles.itemText, { color: '#e285f4' }]} key={i} numberOfLines={1}>
                                {e}
                              </Text>
                            ))}
                          </View>
                        )}
                      </View>
                      <View style={[styles.col, { borderLeftWidth: StyleSheet.hairlineWidth, borderColor: '#111111' }]}>
                        <View style={styles.colHeaderRow}>
                          <Text style={[styles.colHeader, { color: 'orange' }]}>Recipes</Text>
                          <FontAwesome5 name="pepper-hot" size={16} color="orange" />
                        </View>
                        {d.recipes.length === 0 ? (
                          <View style={styles.placeholderCol}>
                            <FontAwesome5 name="wine-bottle" size={28} color="#ffffff" />
                            <FontAwesome5 name="wine-glass-alt" size={28} color="#ffffff" style={{ marginTop: 18 }} />
                          </View>
                        ) : (
                          <View style={{ marginTop: 6 }}>
                            {d.recipes.slice(0, 5).map((r, i) => (
                              <Text style={[styles.itemText, { color: 'orange' }]} key={i} numberOfLines={1}>
                                {r}
                              </Text>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
      </View>

      {/* Recipes section */}
      <View style={styles.section}>
        <TouchableOpacity style={[styles.cta, { borderColor: theme.colors.recipeBorder, borderWidth: 2 }]} onPress={() => router.push('/recipes' as any)}>
          <LinearGradient
            colors={theme.gradients.recipeCard.colors as any}
            start={theme.gradients.recipeCard.start as any}
            end={theme.gradients.recipeCard.end as any}
            style={[StyleSheet.absoluteFill, { borderRadius: 8 }]}
            pointerEvents="none"
          />
          <Text style={[styles.ctaText, { color: '#000' }]}>Recipes</Text>
        </TouchableOpacity>
        {/* Horizontal lists matching web home */}
        {/* Removed 'My Recipes' header to match web */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}
          style={{ marginTop: 6 }}>
          {loadingLists
            ? Array.from({ length: 4 }).map((_, i) => (<View key={`rs-${i}`} style={[styles.miniCard, styles.skeleton]} />))
            : recipes.map((item) => (
                <TouchableOpacity key={item.id} activeOpacity={0.85}
                  onPress={() => router.push((`/recipeBasic/${encodeURIComponent(item.id)}`) as any)}>
                  <View style={[styles.miniCard, { borderColor: theme.colors.recipeBorder, borderWidth: StyleSheet.hairlineWidth }] }>
                    <LinearGradient
                      colors={theme.gradients.recipeCard.colors as any}
                      start={theme.gradients.recipeCard.start as any}
                      end={theme.gradients.recipeCard.end as any}
                      style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
                      pointerEvents="none"
                    />
                    <Text numberOfLines={1} style={[styles.miniTitle, { color: '#000' }]}>{item.name || item.id}</Text>
                    <ScrollView style={styles.cardInnerScroll} nestedScrollEnabled>
                      {item.ingredients ? (
                        <>
                          <Text style={[styles.cardSectionTitle, { color: 'orange' }]}>Ingredients</Text>
                          <Text style={styles.cardText}>{String(item.ingredients)}</Text>
                        </>
                      ) : null}
                      {item.instructions ? (
                        <>
                          <Text style={[styles.cardSectionTitle, { color: 'orange', marginTop: 6 }]}>Instructions</Text>
                          <Text style={styles.cardText}>{String(item.instructions)}</Text>
                        </>
                      ) : null}
                      {!item.ingredients && !item.instructions && item.description ? (
                        <Text style={styles.cardText}>{item.description}</Text>
                      ) : null}
                    </ScrollView>
                  </View>
                </TouchableOpacity>
              ))}
        </ScrollView>
      </View>

      {/* Exercises section */}
      <View style={styles.section}>
        <TouchableOpacity style={[styles.cta, { borderColor: theme.colors.exerciseBorder, borderWidth: 2 }]} onPress={() => router.push('/exercises' as any)}>
          <LinearGradient
            colors={theme.gradients.exerciseCard.colors as any}
            start={theme.gradients.exerciseCard.start as any}
            end={theme.gradients.exerciseCard.end as any}
            style={[StyleSheet.absoluteFill, { borderRadius: 8 }]}
            pointerEvents="none"
          />
          <Text style={[styles.ctaText, { color: '#fff' }]}>Exercises</Text>
        </TouchableOpacity>
        {/* Removed 'My Exercises' header to match web */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}
          style={{ marginTop: 6 }}>
          {loadingLists
            ? Array.from({ length: 4 }).map((_, i) => (<View key={`es-${i}`} style={[styles.miniCard, styles.skeleton]} />))
            : exercises.map((item) => (
                <TouchableOpacity key={item.id} activeOpacity={0.85}
                  onPress={() => router.push((`/exerciseBasic/${encodeURIComponent(item.id)}`) as any)}>
                  <View style={[styles.miniCard, { borderColor: theme.colors.exerciseBorder, borderWidth: StyleSheet.hairlineWidth }] }>
                    <LinearGradient
                      colors={theme.gradients.exerciseCard.colors as any}
                      start={theme.gradients.exerciseCard.start as any}
                      end={theme.gradients.exerciseCard.end as any}
                      style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
                      pointerEvents="none"
                    />
                    <Text numberOfLines={1} style={[styles.miniTitle, { color: '#fff' }]}>{item.name || item.id}</Text>
                    <ScrollView style={styles.cardInnerScroll} nestedScrollEnabled>
                      {item.muscleGroup ? (
                        <>
                          <Text style={[styles.cardSectionTitle, { color: '#e285f4' }]}>Muscle Group</Text>
                          <Text style={styles.cardText}>{String(item.muscleGroup)}</Text>
                        </>
                      ) : null}
                      {item.instructions ? (
                        <>
                          <Text style={[styles.cardSectionTitle, { color: '#e285f4', marginTop: 6 }]}>Instructions</Text>
                          <Text style={styles.cardText}>{String(item.instructions)}</Text>
                        </>
                      ) : null}
                      {!item.muscleGroup && !item.instructions && item.description ? (
                        <Text style={styles.cardText}>{item.description}</Text>
                      ) : null}
                    </ScrollView>
                  </View>
                </TouchableOpacity>
              ))}
        </ScrollView>
      </View>

      <View style={{ height: 24 }} />
      <Text style={styles.sectionHeader}>Coming Soon</Text>
      <View style={styles.infoBox}><Text>Snapshot Grocery List</Text></View>

      <View style={{ height: 24 }} />
      <Text style={styles.sectionHeader}>Known Bugs</Text>
      <View style={[styles.infoBox, { backgroundColor: '#fee2e2', borderColor: '#fecaca' }]}>
        <Text>
          If you update a card name and that card is already in your routine, you will have to update the card
          slot in calendar to reflect accurate routine.
        </Text>
      </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, paddingTop: 48 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  accountBtn: {
    backgroundColor: '#e5e7eb',
    padding: 10,
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: { fontSize: 34, fontWeight: '800', marginBottom: 8, color: '#fff' },
  subtitle: { fontSize: 16, color: '#e5e7eb', marginBottom: 12, textAlign: 'center' },
  section: { marginVertical: 20 },
  dayCard: { padding: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: '#ddd', borderRadius: 8 },
  dayTitle: { fontSize: 16, fontWeight: '700' },
  dayLine: { fontSize: 14, color: '#333', marginTop: 2 },
  hRow: { paddingHorizontal: 4, gap: 12 },
  dayRect: {
    width: 380,
    height: 300,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#333333',
    backgroundColor: '#11111177',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardHeader: { fontWeight: '700', fontSize: 16, marginBottom: 8, color: '#ffffff', textAlign: 'center', width: '100%' },
  cardBody: { flex: 1, flexDirection: 'row' },
  restBody: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  restTitle: { fontFamily: 'serif', fontSize: 18, textAlign: 'center', color: '#ffffff' },
  cloudRow: { flexDirection: 'row', justifyContent: 'space-around', width: '90%', marginTop: 10 },
  col: { flex: 1, paddingHorizontal: 6 },
  colHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  colHeader: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  itemText: { fontSize: 14, marginBottom: 4 },
  emptyText: { color: '#9ca3af' },
  placeholderCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
  skeletonCard: {
    width: 380,
    height: 300,
    borderRadius: 10,
    backgroundColor: '#11111177',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#333333',
  },
  cta: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  ctaText: { fontSize: 18, fontWeight: '700' },
  sectionHeader: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  infoBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  miniCard: {
    width: 300,
    height: 220,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    backgroundColor: 'transparent',
    padding: 12,
    overflow: 'hidden',
  },
  recipeMini: { },
  exerciseMini: { },
  miniTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  miniSub: { color: '#6b7280' },
  skeleton: { backgroundColor: '#f3f4f6' },
  cardInnerScroll: { flex: 1 },
  cardSectionTitle: { fontWeight: '700' },
  cardText: { color: '#374151', lineHeight: 18 },
});

function SkeletonRow() {
  return (
    <View style={{
      height: 64,
      backgroundColor: '#f3f4f6',
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#e5e7eb',
    }} />
  );
}
