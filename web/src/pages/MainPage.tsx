import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MenuItem, CATEGORIES } from '../types';
import { subscribeToMenus } from '../services/menuService';

interface MainPageProps {
  onOrderClick: () => void;
  onLoginClick: () => void;
}

const MainPage = ({ onOrderClick, onLoginClick }: MainPageProps) => {
  const { user, logoutUser } = useAuth();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  // 배너 데이터 (앱 스타일)
  const banners = [
    {
      id: 1,
      title: '2024 WINTER',
      title2: 'e-FREQUENCY',
      subtitle: '[행사 기간] 12/01(일) ~ 12/31(화)',
      bg: 'linear-gradient(to right, #2E7D32 0%, #4CAF50 50%, #81C784 100%)',
      icon: '❄️',
    },
    {
      id: 2,
      title: '크리스마스 시즌',
      title2: '스페셜 음료',
      subtitle: '달콤한 연말의 시작',
      bg: 'linear-gradient(to right, #C62828 0%, #E53935 50%, #EF9A9A 100%)',
      icon: '🎁',
    },
    {
      id: 3,
      title: '신규 회원',
      title2: '첫 주문 할인',
      subtitle: '아메리카노 50% 할인',
      bg: 'linear-gradient(to right, #5D4037 0%, #795548 50%, #A1887F 100%)',
      icon: '🏷️',
    },
  ];

  // 메뉴 실시간 구독
  useEffect(() => {
    const unsubscribe = subscribeToMenus((menuList) => {
      setMenus(menuList);
    });
    return () => unsubscribe();
  }, []);

  // 배너 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // 추천 메뉴 (4개)
  const recommendedMenus = menus
    .filter((menu) => menu.isAvailable)
    .slice(0, 4);

  // 가격 포맷
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  // 로그아웃
  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#faf9f7',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflowX: 'hidden'
    }}>
      {/* 헤더 */}
      <header style={{
        backgroundColor: 'white',
        padding: '0.75rem 1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* 로고 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5D4037" strokeWidth="2">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" y1="2" x2="6" y2="4" />
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="14" y1="2" x2="14" y2="4" />
            </svg>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              color: '#5D4037',
              letterSpacing: '-0.02em'
            }}>
              Cafe Order
            </span>
          </div>

          {/* 네비게이션 */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* 주문하기 버튼 */}
            <button
              onClick={onOrderClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                background: 'linear-gradient(135deg, #5D4037 0%, #4E342E 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '2rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(93, 64, 55, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(93, 64, 55, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(93, 64, 55, 0.3)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              주문하기
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="프로필"
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%',
                      border: '2px solid #E8E0DB'
                    }}
                  />
                ) : (
                  <span style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#5D4037',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    border: '1px solid #D7CCC8',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#5D4037',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                style={{
                  padding: '0.625rem 1.25rem',
                  backgroundColor: 'transparent',
                  border: '1.5px solid #5D4037',
                  color: '#5D4037',
                  borderRadius: '2rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5D4037';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#5D4037';
                }}
              >
                로그인
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* 히어로 섹션 - 앱 스타일 배너 */}
      <section style={{
        background: banners[currentBanner].bg,
        padding: '2.5rem 1rem',
        position: 'relative',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
        borderRadius: '1rem',
        margin: '1rem auto',
        maxWidth: '1000px',
        overflow: 'hidden',
        transition: 'background 0.5s ease'
      }}>
        {/* 컨텐츠 */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem',
          position: 'relative',
          zIndex: 1
        }}>
          {/* 텍스트 영역 */}
          <div style={{ color: 'white' }}>
            {/* 타이틀 1 */}
            <h1 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '700',
              marginBottom: '0.25rem',
              letterSpacing: '-0.01em',
              lineHeight: 1.2
            }}>
              {banners[currentBanner].title}
            </h1>
            
            {/* 타이틀 2 */}
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '700',
              marginBottom: '0.75rem',
              letterSpacing: '-0.01em',
              lineHeight: 1.2
            }}>
              {banners[currentBanner].title2}
            </h2>

            {/* 서브타이틀 */}
            <p style={{ 
              fontSize: '0.9rem',
              opacity: 0.9,
              fontWeight: '400'
            }}>
              {banners[currentBanner].subtitle}
            </p>
          </div>

          {/* 아이콘 영역 */}
          <div style={{
            fontSize: '5rem',
            opacity: 0.3
          }}>
            {banners[currentBanner].icon}
          </div>
        </div>

        {/* 배너 인디케이터 */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 2
        }}>
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              style={{
                width: index === currentBanner ? '1.5rem' : '0.5rem',
                height: '0.5rem',
                borderRadius: '1rem',
                border: 'none',
                backgroundColor: index === currentBanner ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </section>

      {/* 추천 메뉴 섹션 */}
      <section style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '3rem 1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ 
            fontSize: '1.375rem', 
            fontWeight: '700', 
            color: '#3E2723',
            letterSpacing: '-0.02em'
          }}>
            추천 메뉴
          </h2>
          <button
            onClick={onOrderClick}
            style={{
              background: 'none',
              border: 'none',
              color: '#8D6E63',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            전체보기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        {recommendedMenus.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#8D6E63' }}>
            <p>메뉴를 불러오는 중...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.25rem'
          }}>
            {recommendedMenus.map((menu) => (
              <div
                key={menu.id}
                onClick={onOrderClick}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid #F5F0ED'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                }}
              >
                {/* 메뉴 이미지 */}
                <div style={{
                  height: '150px',
                  backgroundColor: '#F5F0ED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {menu.imageUrl ? (
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '3.5rem' }}>
                      {CATEGORIES.find((c) => c.id === menu.category)?.icon || '☕'}
                    </span>
                  )}
                </div>

                {/* 메뉴 정보 */}
                <div style={{ padding: '1rem' }}>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: '#8D6E63', 
                    fontWeight: '600', 
                    marginBottom: '0.375rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {CATEGORIES.find((c) => c.id === menu.category)?.name || '메뉴'}
                  </p>
                  <h3 style={{ 
                    fontWeight: '600', 
                    fontSize: '1rem', 
                    marginBottom: '0.5rem',
                    color: '#3E2723'
                  }}>
                    {menu.name}
                  </h3>
                  <p style={{ 
                    fontWeight: '700', 
                    color: '#5D4037', 
                    fontSize: '1.125rem' 
                  }}>
                    {formatPrice(menu.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 카테고리 섹션 */}
      <section style={{
        backgroundColor: '#F5F0ED',
        padding: '3rem 1rem'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '1.375rem', 
            fontWeight: '700', 
            marginBottom: '1.5rem', 
            textAlign: 'center',
            color: '#3E2723'
          }}>
            카테고리
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem'
          }}>
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={onOrderClick}
                style={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '1.5rem 1rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                }}
              >
                <span style={{ fontSize: '2.25rem', display: 'block', marginBottom: '0.5rem' }}>
                  {category.icon}
                </span>
                <span style={{ fontWeight: '600', color: '#5D4037', fontSize: '0.9rem' }}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer style={{
        backgroundColor: '#3E2723',
        color: 'white',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem', 
            marginBottom: '0.75rem' 
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            </svg>
            <span style={{ fontSize: '1.125rem', fontWeight: '600' }}>Cafe Order</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
            © 2024 Cafe Order. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;