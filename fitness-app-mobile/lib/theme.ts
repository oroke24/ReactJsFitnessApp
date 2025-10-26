// Central theme mapping web styles to mobile
export const theme = {
  colors: {
    textDark: '#111827',
    textLight: '#ffffff',
    neutralBgLight: '#f8fafc',
    neutralBorder: '#e5e7eb',
    recipeBorder: 'orange',
    exerciseBorder: 'indigo',
  },
  gradients: {
    // Approximation of web .dark-light-gradient-left-right (linear)
    screenDarkLightLR: {
      colors: ['#222222', '#666666', '#AAAAAA'],
      start: { x: 0, y: 0.5 },
      end: { x: 1, y: 0.5 },
    },
    // Web: recipe-gradient radial(red->yellow) approximated with linear
    recipeCard: {
      colors: ['#FF0000', '#FFFF00'],
      start: { x: 0, y: 0.5 },
      end: { x: 1, y: 0.5 },
    },
    // Web: exercise-gradient radial(purple->periwinkle) approximated with linear
    exerciseCard: {
      colors: ['#992299', '#9999FF'],
      start: { x: 0, y: 0.5 },
      end: { x: 1, y: 0.5 },
    },
    // Web: calendar-gradient radial(grey->transparent) approximated
    calendarPanel: {
      colors: ['#DDDDDD88', '#FFFFFF88'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
} as const;

export type Theme = typeof theme;
