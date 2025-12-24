import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { user, loading, loginWithGoogle, logoutUser } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#faf9f7'
      }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#faf9f7',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%',
        margin: '1rem'
      }}>
        {/* 로고 & 타이틀 */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>☕</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#78350f' }}>
            카페 오더
          </h1>
          <p style={{ color: '#a16207', marginTop: '0.5rem' }}>
            간편하게 주문하세요
          </p>
        </div>

        {/* 로그인 상태에 따른 UI */}
        {user ? (
          // 로그인된 상태
          <div style={{ textAlign: 'center' }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '0.5rem',
              marginBottom: '1rem'
            }}>
              <p style={{ color: '#166534', fontWeight: '600' }}>✅ 로그인됨</p>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="프로필"
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    margin: '1rem auto'
                  }}
                />
              )}
              <p style={{ fontWeight: '500' }}>{user.displayName}</p>
              <p style={{ color: '#666', fontSize: '0.875rem' }}>{user.email}</p>
            </div>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              로그아웃
            </button>

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#fef3c7',
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}>
              <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📌 다음 단계:</p>
              <p>로그인 성공! Git 커밋 후 다음 단계로 진행하세요.</p>
            </div>
          </div>
        ) : (
          // 로그인 안된 상태
          <div>
            {/* 에러 메시지 */}
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            {/* Google 로그인 버튼 */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                backgroundColor: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                opacity: isLoggingIn ? 0.6 : 1
              }}
            >
              {isLoggingIn ? (
                <span>로그인 중...</span>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google로 계속하기</span>
                </>
              )}
            </button>

            {/* 안내 문구 */}
            <p style={{
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginTop: '1.5rem'
            }}>
              로그인하면 서비스 이용약관에 동의하게 됩니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
