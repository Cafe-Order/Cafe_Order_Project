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

  // 메인 컬러
  const MAIN_COLOR = '#204031';
  const MAIN_LIGHT = '#2D5A45';
  const MAIN_LIGHTER = '#E8F0EC';

  // 배너 데이터
const banners = [
  {
    id: 1,
    title: '2025 WINTER',
    title2: 'e-FREQUENCY',
    subtitle: '[행사 기간] 12/01(일) ~ 12/31(화)',
    bg: 'linear-gradient(135deg, #20591E 0%, #1A4717 100%)',
    icon: (
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="4.5" y1="4.5" x2="19.5" y2="19.5" />
        <line x1="19.5" y1="4.5" x2="4.5" y2="19.5" />
      </svg>
    ),
  },
  {
    id: 2,
    title: '크리스마스 시즌',
    title2: '스페셜 음료',
    subtitle: '달콤한 연말의 시작',
    bg: 'linear-gradient(135deg, #A63232 0%, #7E2626 100%)',
    icon: (
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
        <path d="M22 7H2v5h20V7z" />
        <path d="M12 7v15" />
        <path d="M12 7H8.5a2.5 2.5 0 1 1 0-5c2.4 0 3.5 2.7 3.5 5z" />
        <path d="M12 7h3.5a2.5 2.5 0 1 0 0-5c-2.4 0-3.5 2.7-3.5 5z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: '신규 회원',
    title2: '첫 주문 할인',
    subtitle: '아메리카노 50% 할인',
    bg: 'linear-gradient(135deg, #593F2F 0%, #3F2C21 100%)',
    icon: (
           <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12l-8 8a2 2 0 0 1-2.8 0L2 12V2h10l8 8z" />
        <circle cx="7" cy="7" r="1.5" />
      </svg>
    ),
  },
];

  // 이벤트 카드 데이터 (스타벅스 느낌: 여백/타이포 중심 + 은은한 포인트 컬러)
  const events = [
    {
      id: 1,
      badge: '매주 월요일',
      badgeTone: 'soft',
      title: '스탬프 더블 적립',
      desc: '아침 9~11시 아메리카노 주문 시 스탬프 2배 적립',
      period: '~ 12/31',
      accent: '#00704A',
      icon: '⭐',
    },
    {
      id: 2,
      badge: '연말 한정',
      badgeTone: 'sparkle',
      title: '홀리데이 세트',
      desc: '크리스마스 라떼 + 시나몬 번 세트 15% 할인',
      period: '12/15 - 12/31',
      accent: '#1E3932',
      icon: '🎄',
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
      backgroundColor: '#F9F9F9',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowX: 'hidden'
    }}>
      {/* 헤더 */}
      <header style={{
        backgroundColor: 'white',
        padding: '1rem 1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* 로고 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: MAIN_COLOR,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/>
                <line x1="6" y1="2" x2="6" y2="4"/>
                <line x1="10" y1="2" x2="10" y2="4"/>
                <line x1="14" y1="2" x2="14" y2="4"/>
              </svg>
            </div>
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800', 
              color: MAIN_COLOR,
              letterSpacing: '-0.02em'
            }}>
              CAFE ORDER
            </span>
          </div>

          {/* 네비게이션 */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* 주문하기 버튼 */}
            <button
              onClick={onOrderClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: MAIN_COLOR,
                color: 'white',
                border: 'none',
                borderRadius: '2rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = MAIN_LIGHT;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = MAIN_COLOR;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Order
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="프로필"
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%',
                      border: `2px solid ${MAIN_LIGHTER}`
                    }}
                  />
                ) : (
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: MAIN_COLOR,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}>
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    border: `1px solid #ddd`,
                    borderRadius: '2rem',
                    fontSize: '0.875rem',
                    color: '#666',
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
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  border: `2px solid ${MAIN_COLOR}`,
                  color: MAIN_COLOR,
                  borderRadius: '2rem',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = MAIN_COLOR;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = MAIN_COLOR;
                }}
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* 배너 섹션 */}
      <section style={{
        maxWidth: '1200px',
        margin: '1.5rem auto',
        padding: '0 1.5rem'
      }}>
        <div style={{
          background: banners[currentBanner].bg,
          padding: '3.75rem 2.75rem',
          borderRadius: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.5s ease',
          minHeight: '260px',
          display: 'flex',
          alignItems: 'center'
        }}>
          {/* 컨텐츠 */}
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* 텍스트 영역 */}
            <div style={{ color: 'white' }}>
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: '800',
                marginBottom: '0.25rem',
                letterSpacing: '-0.01em',
                lineHeight: 1.2
              }}>
                {banners[currentBanner].title}
              </h1>
              
              <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: '800',
                marginBottom: '1rem',
                letterSpacing: '-0.01em',
                lineHeight: 1.2
              }}>
                {banners[currentBanner].title2}
              </h2>

              <p style={{ 
                fontSize: '1rem',
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
            bottom: '1.25rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.5rem'
          }}>
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                style={{
                  width: index === currentBanner ? '1.75rem' : '0.5rem',
                  height: '0.5rem',
                  borderRadius: '1rem',
                  border: 'none',
                  backgroundColor: index === currentBanner ? 'white' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 추천 메뉴 섹션 */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: '#1E1E1E',
            letterSpacing: '-0.02em'
          }}>
            추천 메뉴
          </h2>
          <button
            onClick={onOrderClick}
            style={{
              background: 'none',
              border: 'none',
              color: MAIN_COLOR,
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.95rem'
            }}
          >
            전체보기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        {recommendedMenus.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
            <p>메뉴를 불러오는 중...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {recommendedMenus.map((menu) => (
              <div
                key={menu.id}
                onClick={onOrderClick}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                }}
              >
                {/* 메뉴 이미지 */}
                <div style={{
                  height: '180px',
                  backgroundColor: MAIN_LIGHTER,
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
                    <span style={{ fontSize: '4rem' }}>
                      {CATEGORIES.find((c) => c.id === menu.category)?.icon || '☕'}
                    </span>
                  )}
                </div>

                {/* 메뉴 정보 */}
                <div style={{ padding: '1.25rem' }}>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: MAIN_COLOR, 
                    fontWeight: '600', 
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {CATEGORIES.find((c) => c.id === menu.category)?.name || '메뉴'}
                  </p>
                  <h3 style={{ 
                    fontWeight: '600', 
                    fontSize: '1.125rem', 
                    marginBottom: '0.5rem',
                    color: '#1E1E1E'
                  }}>
                    {menu.name}
                  </h3>
                  <p style={{ 
                    fontWeight: '700', 
                    color: MAIN_COLOR, 
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

      {/* 이벤트 카드 섹션 (추천 메뉴 아래) */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem 1.75rem'
      }}>
        {/* 섹션 헤더 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '1rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#1E1E1E',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            이벤트
          </h2>
          <span style={{
            fontSize: '0.9rem',
            color: '#777'
          }}>
            놓치기 전에 참여해 보세요
          </span>
        </div>

        {/* 카드 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1rem'
        }}>
          {events.map((ev) => (
            <div
              key={ev.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '1.25rem',
                border: '1px solid rgba(32,64,49,0.12)',
                boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'stretch',
                minHeight: '140px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'translateY(-3px)';
  e.currentTarget.style.boxShadow = '0 12px 26px rgba(0,0,0,0.10)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.06)';
}}
            >
              {/* 좌측 포인트 바 (Starbucks 느낌) */}
              <div style={{
  width: '10px',
  backgroundColor: ev.accent, // 단색
}} />

              {/* 본문 */}
              <div style={{
                flex: 1,
                padding: '1.25rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                {/* 텍스트 */}
                <div style={{ minWidth: 0 }}>
                  {/* 뱃지 */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '999px',
                    backgroundColor: ev.badgeTone === 'sparkle' ? 'rgba(0,112,74,0.08)' : 'rgba(32,64,49,0.06)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    color: '#1E3932',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em'
                  }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: ev.accent
                    }} />
                    {ev.badge}
                    {ev.badgeTone === 'sparkle' ? <span style={{ marginLeft: '0.25rem' }}>✨</span> : null}
                  </div>

                  <h3 style={{
                    margin: '0.75rem 0 0.35rem',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#1E1E1E',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.25,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {ev.title}
                  </h3>

                  <p style={{
                    margin: 0,
                    color: '#555',
                    fontSize: '0.95rem',
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {ev.desc}
                  </p>

                  <div style={{
                    marginTop: '0.9rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#333'
                    }}>
                      {ev.period}
                    </span>

                    <button
                      onClick={onOrderClick}
                      style={{
                        padding: '0.55rem 1rem',
                        borderRadius: '999px',
                        border: 'none',
                        backgroundColor: MAIN_COLOR,
                        color: 'white',
                        fontWeight: 800,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = MAIN_LIGHT;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = MAIN_COLOR;
                      }}
                    >
                      주문하기
                    </button>
                  </div>
                </div>

                {/* 우측 비주얼 (이미지 자리: 나중에 컵/제품 이미지로 교체 가능) */}
                <div style={{
                  width: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '92px',
                    height: '92px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(232,240,236,0.9))`,
                    border: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: ev.accent,
                    fontSize: '2.1rem',
                    boxShadow: '0 10px 18px rgba(0,0,0,0.08)'
                  }}>
                    {ev.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section style={{
        backgroundColor: MAIN_LIGHTER,
        padding: '3rem 1.5rem',
        marginTop: '1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            marginBottom: '1.5rem', 
            textAlign: 'center',
            color: '#1E1E1E'
          }}>
            카테고리
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem'
          }}>
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={onOrderClick}
                style={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '2rem 1rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                }}
              >
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>
                  {category.icon}
                </span>
                <span style={{ fontWeight: '600', color: MAIN_COLOR, fontSize: '1rem' }}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer style={{
        backgroundColor: MAIN_COLOR,
        color: 'white',
        padding: '2.5rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem', 
            marginBottom: '1rem' 
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/>
              <line x1="6" y1="2" x2="6" y2="4"/>
              <line x1="10" y1="2" x2="10" y2="4"/>
              <line x1="14" y1="2" x2="14" y2="4"/>
            </svg>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>CAFE ORDER</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            © 2024 Cafe Order. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
