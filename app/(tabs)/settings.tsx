import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllEntries } from '../../src/storage/diary';
import { Colors, Spacing, Radius } from '../../src/theme';

export default function SettingsScreen() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    getAllEntries().then((e) => setCount(e.length));
  }, []);

  const handleClear = () => {
    Alert.alert(
      'Очистить дневник?',
      'Все записи будут удалены без возможности восстановления.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить всё',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            setCount(0);
            Alert.alert('Готово', 'Все данные удалены.');
          },
        },
      ]
    );
  };

  const Row = ({
    label,
    value,
    onPress,
    danger,
  }: {
    label: string;
    value?: string;
    onPress?: () => void;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.rowLabel, danger && styles.danger]}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.header}>
        <Text style={styles.title}>НАСТРОЙКИ</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>СТАТИСТИКА</Text>
        <Row label="Всего записей" value={String(count)} />
        <Row label="Хранилище" value="Только на устройстве" />
        <Row label="Интернет" value="Не используется" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ПРИЛОЖЕНИЕ</Text>
        <Row label="Версия" value="1.0.0" />
        <Row label="Тема" value="Тёмная" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ДАННЫЕ</Text>
        <Row label="Удалить все записи" onPress={handleClear} danger />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ◎  Все данные хранятся исключительно на вашем устройстве
        </Text>
      </View>
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
  section: { marginTop: Spacing.lg, paddingHorizontal: Spacing.md },
  sectionTitle: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#161616',
  },
  rowLabel: { fontSize: 14, color: Colors.text },
  rowValue: { fontSize: 13, color: Colors.textSecondary },
  danger: { color: '#F0A8A8' },
  footer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.3,
  },
});
