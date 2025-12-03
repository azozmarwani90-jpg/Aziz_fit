import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';
import toast from 'react-hot-toast';
import { Button } from './ui';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');

    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const html = document.documentElement;
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('تم تسجيل الخروج بنجاح');
      router.push('/login');
    } catch (error) {
      toast.error('فشل تسجيل الخروج');
    }
  };

  // Don't show navbar on auth pages
  const hideNav = ['/login', '/signup', '/'].includes(router.pathname);

  if (!mounted) return <>{children}</>;

  return (
    <div className="min-h-screen bg-luxury-pearl dark:bg-gray-950 transition-colors duration-300">
      {!hideNav && user && (
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <button
                onClick={() => router.push('/dashboard')}
                className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                سعراتي
              </button>

              {/* Navigation Links */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => router.push('/dashboard')}
                  className={`px-4 py-2 rounded-2xl font-semibold transition-all ${
                    router.pathname === '/dashboard'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-800'
                  }`}
                >
                  الرئيسية
                </button>
                <button
                  onClick={() => router.push('/history')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    router.pathname === '/history'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  السجل
                </button>
                <button
                  onClick={() => router.push('/stats')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    router.pathname === '/stats'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  الإحصائيات
                </button>
                <button
                  onClick={() => router.push('/scan')}
                  className={`px-4 py-2 rounded-2xl font-semibold transition-all ${
                    router.pathname === '/scan'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-800'
                  }`}
                >
                  تحليل وجبة
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className={`px-4 py-2 rounded-2xl font-semibold transition-all ${
                    router.pathname === '/profile'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-800'
                  }`}
                >
                  الملف الشخصي
                </button>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  title={theme === 'light' ? 'تفعيل الوضع الليلي' : 'تفعيل الوضع النهاري'}
                >
                  {theme === 'light' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657 9.193l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM5 11a1 1 0 100-2H4a1 1 0 100 2h1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  variant="danger"
                  size="sm"
                  className="hidden sm:flex"
                >
                  تسجيل خروج
                </Button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main>{children}</main>
    </div>
  );
}
