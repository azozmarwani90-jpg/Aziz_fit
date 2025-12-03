import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';
import toast from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen bg-luxury-pearl">
      {!hideNav && user && (
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4 space-x-reverse">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent"
                >
                  سعراتي
                </button>
              </div>

              <div className="flex items-center space-x-4 space-x-reverse">
                <button
                  onClick={() => router.push('/dashboard')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    router.pathname === '/dashboard'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'text-gray-600 hover:text-emerald-600'
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
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    router.pathname === '/scan'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  تحليل وجبة
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    router.pathname === '/profile'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  الملف الشخصي
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  تسجيل خروج
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main>{children}</main>
    </div>
  );
}
