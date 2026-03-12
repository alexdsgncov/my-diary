export const Colors = {
  bg: '#000000',
  surface: '#111111',
  surfaceHover: '#1A1A1A',
  border: '#222222',
  borderLight: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#888888',
  textMuted: '#444444',
  accent: '#FFFFFF',
  accentDim: '#333333',
};

export const Typography = {
  title: {
    fontFamily: undefined,
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    color: Colors.text,
  },
  heading: {
    fontSize: 18,
    fontWeight: '500' as const,
    color: Colors.text,
    letterSpacing: 0.3,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: Colors.text,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  mono: {
    fontSize: 11,
    fontWeight: '400' as const,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};
