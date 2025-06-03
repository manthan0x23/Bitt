import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

export const ThemeSwitch = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme =
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('theme='))
        ?.split('=')[1] ?? 'light';

    setTheme(savedTheme as 'light' | 'dark');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    document.cookie = `theme=${nextTheme}; path=/; max-age=31536000`;
    setTheme(nextTheme);

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
      className="p-2 rounded-full transition cursor-pointer"
      title="Toggle theme"
    >
      {theme === 'dark' ? <MdLightMode size={26} /> : <MdDarkMode size={26} />}
    </Button>
  );
};
