import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import DiaryCard from '../../src/components/DiaryCard';
import { DiaryEntry } from '../../src/types';
import { getFavorites } from '../../src/storage/diary';
import { Colors, Spacing } from '../../src/theme';

export default function FavoritesScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      getFavorites().then(setEntries);
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.header}>
        <Text style={styles.title}>ИЗБРАННОЕ</Text>
        <Text style={styles.subtitle}>{entries.length} записей</Text>
      </View>

      {entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptySymbol}>♡</Text>
          <Text style={styles.emptyTitle}>Нет избранных</Text>
          <Text style={styles.emptyText}>
            Долгое нажатие на запись добавляет её в избранное
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(e) => e.id}
          renderItem={({ item }) => (
            <DiaryCard
              entry={item}
              onPress={() =>
                router.push({ pathname: '/entry', params: { id: item.id } })
              }
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl + 8,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#161616',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 3,
  },
  subtitle: { fontSize: 11, color: Colors.textMuted, letterSpacing: 1 },
  list: { paddingTop: Spacing.md, paddingBottom: 100 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: 48,
  },
  emptySymbol: { fontSize: 40, color: Colors.textMuted },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '300',
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
  },
});
