import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryEntry } from '../types';

const ENTRIES_KEY = '@diary_entries';

export async function getAllEntries(): Promise<DiaryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(ENTRIES_KEY);
    if (!raw) return [];
    const entries: DiaryEntry[] = JSON.parse(raw);
    return entries.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

export async function saveEntry(entry: DiaryEntry): Promise<void> {
  const entries = await getAllEntries();
  const idx = entries.findIndex((e) => e.id === entry.id);
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.unshift(entry);
  }
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export async function deleteEntry(id: string): Promise<void> {
  const entries = await getAllEntries();
  const filtered = entries.filter((e) => e.id !== id);
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(filtered));
}

export async function toggleFavorite(id: string): Promise<void> {
  const entries = await getAllEntries();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx >= 0) {
    entries[idx].isFavorite = !entries[idx].isFavorite;
    await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  }
}

export async function getFavorites(): Promise<DiaryEntry[]> {
  const entries = await getAllEntries();
  return entries.filter((e) => e.isFavorite);
}

export async function searchEntries(query: string): Promise<DiaryEntry[]> {
  const entries = await getAllEntries();
  const q = query.toLowerCase();
  return entries.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.content.toLowerCase().includes(q) ||
      e.tags.some((t) => t.toLowerCase().includes(q))
  );
}
