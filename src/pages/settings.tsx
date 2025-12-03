import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-luxury-black flex items-center mb-8">
          <div className="w-1 h-10 bg-gradient-primary rounded-full ml-3"></div>
          الإعدادات
        </h1>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-luxury-black mb-4">معلومات الحساب</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-field bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  معرف المستخدم
                </label>
                <input
                  type="text"
                  value={user?.id || ''}
                  disabled
                  className="input-field bg-gray-100 font-mono text-sm"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-luxury-black mb-4">الإجراءات السريعة</h2>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/profile')}
                className="w-full btn-secondary text-right flex items-center justify-between"
              >
                <span>تحديث أهداف السعرات</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => router.push('/history')}
                className="w-full btn-secondary text-right flex items-center justify-between"
              >
                <span>عرض سجل الوجبات</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => router.push('/stats')}
                className="w-full btn-secondary text-right flex items-center justify-between"
              >
                <span>عرض الإحصائيات</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-luxury-black mb-4">حول التطبيق</h2>
            <div className="space-y-2 text-gray-600">
              <p>سعراتي - تطبيق ذكي لتتبع السعرات الحرارية</p>
              <p>الإصدار: 1.0.0</p>
              <p>مدعوم بتقنية الذكاء الاصطناعي من OpenAI</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
