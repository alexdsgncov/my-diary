import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { DiaryEntry, Mood, MOODS } from '../src/types';
import { getAllEntries, saveEntry } from '../src/storage/diary';
import { Colors, Spacing, Radius } from '../src/theme';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function EntryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('neutral');
  const [tags, setTags] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [existingEntry, setExistingEntry] = useState<DiaryEntry | null>(null);
  const [saved, setSaved] = useState(false);

  const contentRef = useRef<TextInput>(null);

  useEffect(() => {
    if (id) {
      getAllEntries().then((entries) => {
        const found = entries.find((e) => e.id === id);
        if (found) {
          setExistingEntry(found);
          setTitle(found.title);
          setContent(found.content);
          setMood(found.mood);
          setTags(found.tags.join(', '));
          setIsFavorite(found.isFavorite);
        }
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Пустая запись', 'Добавьте заголовок или текст.');
      return;
    }

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const now = new Date().toISOString();
    const entry: DiaryEntry = {
      id: existingEntry?.id ?? generateId(),
      title: title.trim(),
      content: content.trim(),
      mood,
      tags: parsedTags,
      isFavorite,
      createdAt: existingEntry?.createdAt ?? now,
      updatedAt: now,
    };

    await saveEntry(entry);
    setSaved(true);
    router.back();
  };

  const handleDiscard = () => {
    if ((title || content) && !saved) {
      Alert.alert('Отменить изменения?', undefined, [
        { text: 'Продолжить редактирование', style: 'cancel' },
        { text: 'Отменить', style: 'destructive', onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  };

  const now = new Date();
  const dateStr = format(now, "d MMMM yyyy, EEEE", { locale: ru });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleDiscard} style={styles.topBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>

        <Text style={styles.topDate}>{dateStr}</Text>

        <View style={styles.topRight}>
          <TouchableOpacity
            onPress={() => setIsFavorite(!isFavorite)}
            style={styles.topBtn}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#F0A8A8' : Colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>СОХРАНИТЬ</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Mood picker */}
        <View style={styles.moodRow}>
          {(Object.keys(MOODS) as Mood[]).map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.moodBtn, mood === m && styles.moodBtnActive]}
              onPress={() => setMood(m)}
              activeOpacity={0.7}
            >
              <Text style={[styles.moodEmoji, { color: MOODS[m].color }]}>
                {MOODS[m].emoji}
              </Text>
              <Text
                style={[
                  styles.moodLabel,
                  mood === m && { color: Colors.textSecondary },
                ]}
              >
                {MOODS[m].label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Title */}
        <TextInput
          style={styles.titleInput}
          placeholder="Заголовок"
          placeholderTextColor={Colors.textMuted}
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
          onSubmitEditing={() => contentRef.current?.focus()}
          selectionColor={Colors.text}
          maxLength={100}
        />

        <View style={styles.divider} />

        {/* Content */}
        <TextInput
          ref={contentRef}
          style={styles.contentInput}
          placeholder="Что у вас на уме сегодня..."
          placeholderTextColor={Colors.textMuted}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          selectionColor={Colors.text}
        />

        {/* Tags */}
        <View style={styles.tagsRow}>
          <Text style={styles.tagsIcon}>◈</Text>
          <TextInput
            style={styles.tagsInput}
            placeholder="теги через запятую"
            placeholderTextColor={Colors.textMuted}
            value={tags}
            onChangeText={setTags}
            autoCorrect={false}
            autoCapitalize="none"
            selectionColor={Colors.text}
          />
        </View>

        {existingEntry && (
          <Text style={styles.updatedAt}>
            Создано: {format(new Date(existingEntry.createdAt), 'd MMMM yyyy', { locale: ru })}
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.xl + 8,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#161616',
  },
  topBtn: { padding: Spacing.sm },
  topDate: {
    flex: 1,
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.sm,
  },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  saveBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    backgroundColor: Colors.text,
    borderRadius: Radius.sm,
    marginLeft: 4,
  },
  saveBtnText: {
    fontSize: 11,
    color: '#000',
    fontWeight: '700',
    letterSpacing: 1,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md, gap: Spacing.md },
  moodRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  moodBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: Radius.sm,
    backgroundColor: '#0D0D0D',
    borderWidth: 1,
    borderColor: '#1E1E1E',
    gap: 4,
  },
  moodBtnActive: {
    borderColor: '#333',
    backgroundColor: '#161616',
  },
  moodEmoji: { fontSize: 14 },
  moodLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '300',
    color: Colors.text,
    letterSpacing: 0.5,
    padding: 0,
    lineHeight: 32,
  },
  divider: {
    height: 1,
    backgroundColor: '#161616',
  },
  contentInput: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 26,
    minHeight: 260,
    padding: 0,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#161616',
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
  },
  tagsIcon: { fontSize: 14, color: Colors.textMuted },
  tagsInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    padding: 0,
  },
  updatedAt: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginTop: Spacing.sm,
  },
});
