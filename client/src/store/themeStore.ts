import { Store } from '@tanstack/store';

export type ThemeType = 'dark' | 'light';
interface ThemeState {
  theme: ThemeType;
}

export const themeStore = new Store<ThemeState>({
  theme: 'light',
});
