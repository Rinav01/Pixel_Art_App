// import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// export const lightTheme = {
//   ...MD3LightTheme,
//   colors: {
//     ...MD3LightTheme.colors,
//     primary: '#0B5FFF',      // bright blue for tools
//     secondary: '#FF8C00',    // orange accents
//     tertiary: '#00B36B',     // green accents
//     background: '#FFF7E6',   // warm paper-like
//     surface: '#FFF7E6',
//     surfaceVariant: '#F0E6D8',
//     onPrimary: '#FFFFFF',
//     onSecondary: '#FFFFFF',
//     onTertiary: '#FFFFFF',
//     onBackground: '#1A1A1A',
//     onSurface: '#1A1A1A',
//     outline: '#BFAE9A',
//     shadow: '#000000',
//     inverseOnSurface: '#F8F6F2',
//     inverseSurface: '#1A1A1A',
//     inversePrimary: '#BFD7FF',
//     canvasBackground: '#FFFFFF',
//     elevation: {
//       level0: 'transparent',
//       level1: 'rgb(255, 250, 240)',
//       level2: 'rgb(253, 246, 235)',
//       level3: 'rgb(251, 242, 228)',
//       level4: 'rgb(250, 240, 225)',
//       level5: 'rgb(248, 238, 221)',
//     },
//   },
// };

// export const darkTheme = {
//   ...MD3DarkTheme,
//   colors: {
//     ...MD3DarkTheme.colors,
//     primary: '#66A3FF',
//     secondary: '#FFB366',
//     tertiary: '#66E099',
//     background: '#0B0B0F',
//     surface: '#0B0B0F',
//     surfaceVariant: '#1E1B22',
//     onPrimary: '#051027',
//     onSecondary: '#2B1100',
//     onTertiary: '#002B14',
//     onBackground: '#F2F2F2',
//     onSurface: '#F2F2F2',
//     outline: '#7A7176',
//     shadow: '#000000',
//     inverseOnSurface: '#0B0B0F',
//     inverseSurface: '#F2F2F2',
//     inversePrimary: '#0B5FFF',
//     canvasBackground: '#FFFFFF',
//     elevation: {
//       level0: 'transparent',
//       level1: 'rgb(18, 16, 20)',
//       level2: 'rgb(24, 22, 27)',
//       level3: 'rgb(29, 27, 34)',
//       level4: 'rgb(31, 29, 36)',
//       level5: 'rgb(34, 32, 40)',
//     },
//   },
// };


// import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// /* Pico-8 palette inspired theme */
// export const lightTheme = {
//   ...MD3LightTheme,
//   colors: {
//     ...MD3LightTheme.colors,
//     // Using Pico-8 core accents as primary/secondary/tertiary
//     primary: '#1D2B53',       // Pico-8 dark blue
//     secondary: '#7E2553',     // Pico-8 purple
//     tertiary: '#008751',      // Pico-8 green
//     background: '#FFF1E8',    // very light paper (keeps UI readable)
//     surface: '#FFF1E8',
//     surfaceVariant: '#F0E6D8',
//     onPrimary: '#FFFFFF',
//     onSecondary: '#FFFFFF',
//     onTertiary: '#FFFFFF',
//     onBackground: '#1A1A1A',
//     onSurface: '#1A1A1A',
//     outline: '#AB9A82',
//     shadow: '#000000',
//     inverseOnSurface: '#F8F6F2',
//     inverseSurface: '#1A1A1A',
//     inversePrimary: '#7E9EFF',
//     // For pixel art, recommend dark canvas even in 'light' UI for authentic look
//     canvasBackground: '#000000',
//     elevation: {
//       level0: 'transparent',
//       level1: 'rgb(255, 250, 240)',
//       level2: 'rgb(253, 246, 235)',
//       level3: 'rgb(251, 242, 228)',
//       level4: 'rgb(250, 240, 225)',
//       level5: 'rgb(248, 238, 221)',
//     },
//   },
// };

// export const darkTheme = {
//   ...MD3DarkTheme,
//   colors: {
//     ...MD3DarkTheme.colors,
//     // Pico-8 friendly mapping for dark surfaces
//     primary: '#1D2B53',
//     secondary: '#7E2553',
//     tertiary: '#008751',
//     background: '#000000',
//     surface: '#000000',
//     surfaceVariant: '#0F0D10',
//     onPrimary: '#C2C3C7',
//     onSecondary: '#FFF1E8',
//     onTertiary: '#C2C3C7',
//     onBackground: '#F2F2F2',
//     onSurface: '#F2F2F2',
//     outline: '#5F574F',
//     shadow: '#000000',
//     inverseOnSurface: '#000000',
//     inverseSurface: '#FFF1E8',
//     inversePrimary: '#1D2B53',
//     canvasBackground: '#000000', // classic Pico-8 black drawing surface
//     elevation: {
//       level0: 'transparent',
//       level1: 'rgb(8, 8, 10)',
//       level2: 'rgb(14, 13, 16)',
//       level3: 'rgb(18, 17, 21)',
//       level4: 'rgb(20, 19, 23)',
//       level5: 'rgb(22, 21, 26)',
//     },
//   },
// };

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#005FCC',       // strong, accessible blue
    secondary: '#003F7D',     // deep accent for secondary controls
    tertiary: '#D64545',      // attention/error accent (clear on white)
    background: '#FFFFFF',    // pure white for max contrast
    surface: '#FFFFFF',
    surfaceVariant: '#F5F6F8',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onTertiary: '#FFFFFF',
    onBackground: '#0A0A0A',
    onSurface: '#0A0A0A',
    outline: '#6B7280',
    shadow: '#000000',
    inverseOnSurface: '#FFFFFF',
    inverseSurface: '#0A0A0A',
    inversePrimary: '#7FB3FF',
    canvasBackground: '#FFFFFF', // white canvas for professional editing
    elevation: {
      level0: 'transparent',
      level1: 'rgb(245,245,246)',
      level2: 'rgb(238,239,241)',
      level3: 'rgb(230,231,234)',
      level4: 'rgb(226,227,230)',
      level5: 'rgb(222,223,227)',
    },
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#7FB3FF',       // visible but softer on dark surfaces
    secondary: '#4A6FB0',     // muted but clear
    tertiary: '#FF8787',      // alert/call-to-action color
    background: '#0A0A0A',    // near-black for max contrast
    surface: '#0E0E0E',
    surfaceVariant: '#1E1E22',
    onPrimary: '#001630',
    onSecondary: '#001630',
    onTertiary: '#2B0000',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    outline: '#9AA4B2',
    shadow: '#000000',
    inverseOnSurface: '#0A0A0A',
    inverseSurface: '#FFFFFF',
    inversePrimary: '#005FCC',
    canvasBackground: '#FFFFFF', // dark canvas for reduced glare and contrast
    elevation: {
      level0: 'transparent',
      level1: 'rgb(22,22,24)',
      level2: 'rgb(28,28,31)',
      level3: 'rgb(34,34,39)',
      level4: 'rgb(36,36,41)',
      level5: 'rgb(40,40,46)',
    },
  },
};
