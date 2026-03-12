import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DiaryCard from '../../src/components/DiaryCard';
import { DiaryEntry } from '../../src/types';
import { searchEntries } from '../../src/storage/diary';
import { Colors, Spacing } from '../../src/theme';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DiaryEntry[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 1) {
      setResults([]);
      setSearched(false);
      return;
    }
    const data = await searchEntries(text);
    setResults(data);
    setSearched(true);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.header}>
        <Text style={styles.title}>ПОИСК</Text>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={16} color={Colors.textMuted} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Поиск по записям, тегам..."
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={handleSearch}
          autoCorrect={false}
          autoCapitalize="none"
          selectionColor={Colors.text}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {!searched ? (
        <View style={styles.hint}>
          <Text style={styles.hintSymbol}>◈</Text>
          <Text style={styles.hintText}>Введите слово для поиска</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.hint}>
          <Text style={styles.hintSymbol}>◎</Text>
          <Text style={styles.hintText}>Ничего не найдено</Text>
        </View>
      ) : (
        <>
          <Text style={styles.resultCount}>
            {results.length} {results.length === 1 ? 'запись' : 'записей'}
          </Text>
          <FlatList
            data={results}
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
        </>
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
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 3,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
    gap: 10,
  },
  icon: {},
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    padding: 0,
  },
  resultCount: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  list: { paddingBottom: 100 },
  hint: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  hintSymbol: { fontSize: 36, color: Colors.textMuted },
  hintText: { fontSize: 14, color: Colors.textMuted, letterSpacing: 0.5 },
});
