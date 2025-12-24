import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface LoginPageProps {
  onLoginSuccess?: () => void;
  onBack?: () => void;
}

const LoginPage = ({ onLoginSuccess, onBack }: LoginPageProps) => {
  const { user, loading, loginWithGoogle, logoutUser } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 메인 컬러
  const MAIN_COLOR = '#204031';
  const MAIN_LIGHT = '#2D5A45';

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      await loginWithGoogle();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
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
        backgroundColor: '#F9F9F9'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: `3px solid #E8F0EC`,
          borderTopColor: MAIN_COLOR,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F9F9F9',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem 2.5rem',
        borderRadius: '1.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        maxWidth: '420px',
        width: '100%',
        position: 'relative'
      }}>
        {/* 뒤로가기 버튼 */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ←
          </button>
        )}

        {/* 로고 & 타이틀 */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: MAIN_COLOR,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <span style={{ fontSize: '2.5rem' }}>☕</span>
          </div>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '800', 
            color: MAIN_COLOR,
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            CAFE ORDER
          </h1>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            간편하게 주문하세요
          </p>
        </div>

        {/* 로그인 상태에 따른 UI */}
        {user ? (
          // 로그인된 상태
          <div style={{ textAlign: 'center' }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#E8F5E9',
              borderRadius: '1rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{ color: MAIN_COLOR, fontWeight: '600', marginBottom: '1rem' }}>
                ✓ 로그인 완료
              </p>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="프로필"
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    margin: '0 auto 1rem',
                    display: 'block',
                    border: `3px solid ${MAIN_COLOR}`
                  }}
                />
              )}
              <p style={{ fontWeight: '600', color: '#1E1E1E', fontSize: '1.125rem' }}>
                {user.displayName}
              </p>
              <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {user.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: 'white',
                color: '#E53935',
                border: '2px solid #FFCDD2',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              로그아웃
            </button>

            {onLoginSuccess && (
              <button
                onClick={onLoginSuccess}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: MAIN_COLOR,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = MAIN_LIGHT;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = MAIN_COLOR;
                }}
              >
                주문하러 가기 →
              </button>
            )}
          </div>
        ) : (
          // 로그인 안된 상태
          <div>
            {/* 에러 메시지 */}
            {error && (
              <div style={{
                backgroundColor: '#FFEBEE',
                color: '#C62828',
                padding: '1rem',
                borderRadius: '0.75rem',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                textAlign: 'center'
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
                padding: '1rem',
                backgroundColor: 'white',
                border: '2px solid #E0E0E0',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                opacity: isLoggingIn ? 0.7 : 1,
                transition: 'all 0.2s ease',
                marginBottom: '1rem'
              }}
              onMouseEnter={(e) => {
                if (!isLoggingIn) {
                  e.currentTarget.style.borderColor = MAIN_COLOR;
                  e.currentTarget.style.backgroundColor = '#FAFAFA';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E0E0E0';
                e.currentTarget.style.backgroundColor = 'white';
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
                  <span style={{ color: '#333' }}>Google로 계속하기</span>
                </>
              )}
            </button>

            {/* 또는 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              margin: '1.5rem 0',
              color: '#999'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
              <span style={{ fontSize: '0.875rem' }}>또는</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
            </div>

            {/* 게스트 버튼 */}
            <button
              onClick={onOrderClick}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: MAIN_COLOR,
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = MAIN_LIGHT;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = MAIN_COLOR;
              }}
            >
              메뉴 둘러보기
            </button>

            {/* 안내 문구 */}
            <p style={{
              textAlign: 'center',
              fontSize: '0.8rem',
              color: '#999',
              marginTop: '2rem',
              lineHeight: 1.5
            }}>
              로그인하면 서비스 이용약관에 동의하게 됩니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// 게스트용 빈 함수
const onOrderClick = () => {};

export default LoginPage;