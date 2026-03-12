import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import DiaryCard from '../../src/components/DiaryCard';
import { DiaryEntry } from '../../src/types';
import { getAllEntries, deleteEntry, toggleFavorite } from '../../src/storage/diary';
import { Colors, Spacing, Radius } from '../../src/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await getAllEntries();
    setEntries(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleLongPress = (entry: DiaryEntry) => {
    Alert.alert(entry.title || 'Запись', undefined, [
      {
        text: entry.isFavorite ? '♥ Убрать из избранного' : '♡ В избранное',
        onPress: async () => {
          await toggleFavorite(entry.id);
          load();
        },
      },
      {
        text: '✎ Редактировать',
        onPress: () => router.push({ pathname: '/entry', params: { id: entry.id } }),
      },
      {
        text: '✕ Удалить',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Удалить запись?', 'Это действие нельзя отменить.', [
            { text: 'Отмена', style: 'cancel' },
            {
              text: 'Удалить',
              style: 'destructive',
              onPress: async () => {
                await deleteEntry(entry.id);
                load();
              },
            },
          ]),
      },
      { text: 'Отмена', style: 'cancel' },
    ]);
  };

  // Group entries by month
  const grouped = entries.reduce<Record<string, DiaryEntry[]>>((acc, entry) => {
    const key = format(new Date(entry.createdAt), 'LLLL yyyy', { locale: ru });
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  type ListItem =
    | { type: 'header'; key: string; title: string }
    | { type: 'entry'; key: string; entry: DiaryEntry };

  const listData: ListItem[] = [];
  Object.entries(grouped).forEach(([month, monthEntries]) => {
    listData.push({ type: 'header', key: `h-${month}`, title: month });
    monthEntries.forEach((e) =>
      listData.push({ type: 'entry', key: e.id, entry: e })
    );
  });

  const today = format(new Date(), 'd MMMM yyyy', { locale: ru });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>МОЙ ДНЕВНИК</Text>
          <Text style={styles.todayDate}>{today}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.count}>{entries.length} записей</Text>
        </View>
      </View>

      {entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptySymbol}>◎</Text>
          <Text style={styles.emptyTitle}>Пока пусто</Text>
          <Text style={styles.emptyText}>
            Начните записывать свои мысли, события и эмоции
          </Text>
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return (
                <View style={styles.monthHeader}>
                  <Text style={styles.monthText}>{item.title.toUpperCase()}</Text>
                  <View style={styles.monthLine} />
                </View>
              );
            }
            return (
              <DiaryCard
                entry={item.entry}
                onPress={() =>
                  router.push({ pathname: '/entry', params: { id: item.entry.id } })
                }
                onLongPress={() => handleLongPress(item.entry)}
              />
            );
          }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.textSecondary}
            />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/entry')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl + 8,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#161616',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 3,
  },
  todayDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  count: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  list: {
    paddingTop: Spacing.md,
    paddingBottom: 100,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  monthText: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 2,
    fontWeight: '600',
  },
  monthLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1A1A1A',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  emptySymbol: {
    fontSize: 48,
    color: Colors.textMuted,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});
