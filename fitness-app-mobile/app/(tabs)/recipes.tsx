import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { getDocuments } from '../../lib/firebase/firebaseFirestore';
import auth from '../../lib/firebase/firebaseAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../lib/theme';

export default function RecipesTab() {
  const router = useRouter();
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const email = auth.currentUser?.email;
        const path = email ? `users/${email}/recipes` : 'users/guest/recipes';
        const result = await getDocuments(path);
        setDocs(result);
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Recipes',
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
        <View style={styles.container}>
          <Text style={styles.title}>Recipes</Text>
          {loading && <ActivityIndicator />}
          {error && <Text style={styles.error}>Error: {error}</Text>}
          {!loading && !error && (
            <FlatList
              data={docs}
              keyExtractor={(item) => String(item.id)}
              ListHeaderComponent={() => (
                <TouchableOpacity style={styles.newBtn} onPress={() => router.push('/recipe/NewItem' as any)}>
                  <FontAwesome5 name="plus" size={16} color="#111827" style={{ marginRight: 8 }} />
                  <Text style={styles.newBtnText}>New</Text>
                </TouchableOpacity>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => router.push((`/recipeBasic/${encodeURIComponent(item.id)}`) as any)}>
                  <Text style={styles.cardTitle}>{item.name || item.id}</Text>
                  {item.description ? <Text style={styles.cardSub} numberOfLines={2}>{item.description}</Text> : null}
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 12, color: '#fff', textAlign: 'left' },
  error: { color: '#fecaca' },
  newBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#e5e7eb', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, marginBottom: 12 },
  newBtnText: { color: '#111827', fontWeight: '700' },
  card: { padding: 12, borderWidth: 3, borderColor: 'orange', borderRadius: 15, marginBottom: 12, backgroundColor: '#11111177',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4, color: 'orange' },
  cardSub: { color: '#e5e7eb' },
});
