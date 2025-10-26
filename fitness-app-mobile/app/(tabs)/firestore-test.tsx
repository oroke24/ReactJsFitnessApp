import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { getDocuments } from '../../lib/firebase/firebaseFirestore';

export default function FirestoreTest() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getDocuments('users/guest/recipes');
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
    <View style={styles.container}>
      <Text style={styles.title}>Firestore Test (guest recipes)</Text>
      {loading && <ActivityIndicator />}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      {!loading && !error && (
        <FlatList
          data={docs}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.name || item.id}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  error: { color: 'red' },
  item: { paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#ccc' },
  itemTitle: { fontSize: 16 },
});
