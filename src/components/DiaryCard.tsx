import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DiaryEntry, MOODS } from '../types';
import { Colors, Spacing, Radius } from '../theme';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Props {
  entry: DiaryEntry;
  onPress: () => void;
  onLongPress?: () => void;
}

export default function DiaryCard({ entry, onPress, onLongPress }: Props) {
  const mood = MOODS[entry.mood];
  const date = new Date(entry.createdAt);

  const dayNum = format(date, 'd');
  const monthYear = format(date, 'MMM yyyy', { locale: ru });
  const weekday = format(date, 'EEEE', { locale: ru });
  const preview = entry.content.replace(/\n/g, ' ').trim();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <Text style={styles.dayNum}>{dayNum}</Text>
        <Text style={styles.month}>{monthYear}</Text>
        <Text style={styles.weekday}>{weekday}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.right}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {entry.title || 'Без названия'}
          </Text>
          {entry.isFavorite && <Text style={styles.fav}>♥</Text>}
        </View>
        {preview.length > 0 && (
          <Text style={styles.preview} numberOfLines={2}>
            {preview}
          </Text>
        )}
        <View style={styles.footer}>
          <Text style={[styles.moodBadge, { color: mood.color }]}>
            {mood.emoji} {mood.label}
          </Text>
          {entry.tags.length > 0 && (
            <Text style={styles.tags} numberOfLines={1}>
              {entry.tags.map((t) => `#${t}`).join(' ')}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  left: {
    width: 68,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0A0A',
  },
  dayNum: {
    fontSize: 28,
    fontWeight: '200',
    color: Colors.text,
    lineHeight: 30,
  },
  month: {
    fontSize: 10,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  weekday: {
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 0.3,
    marginTop: 4,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#1E1E1E',
  },
  right: {
    flex: 1,
    padding: Spacing.md,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
    letterSpacing: 0.2,
  },
  fav: {
    fontSize: 12,
    color: '#F0A8A8',
    marginLeft: 6,
  },
  preview: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  moodBadge: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  tags: {
    fontSize: 11,
    color: Colors.textMuted,
    flex: 1,
  },
});
