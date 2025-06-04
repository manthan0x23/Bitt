import { Button } from '@/components/ui/button';
import { themeStore, type ThemeType } from '@/store/themeStore';
import { useStore } from '@tanstack/react-store';
import { useEffect } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';

export const ThemeSwitch = ({ className }: { className?: string }) => {
  const { theme } = useStore(themeStore);

  useEffect(() => {
    const savedTheme =
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('theme='))
        ?.split('=')[1] ?? 'light';

    const thusTheme: ThemeType = savedTheme == 'dark' ? 'dark' : 'light';

    themeStore.setState(() => ({ theme: thusTheme }));
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    document.cookie = `theme=${nextTheme}; path=/; max-age=31536000`;
    themeStore.setState(() => ({
      theme: nextTheme,
    }));

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Button
      onClick={toggleTheme}
      size={'icon'}
      variant={'ghost'}
      className={twMerge(
        'p-2 rounded-full transition cursor-pointer',
        className,
      )}
      title="Toggle theme"
    >
      {theme === 'dark' ? <MdLightMode size={26} /> : <MdDarkMode size={26} />}
    </Button>
  );
};
