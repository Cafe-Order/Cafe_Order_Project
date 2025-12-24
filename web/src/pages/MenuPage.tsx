import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCartStore } from '../store/useStore';
import { MenuItem, CATEGORIES, MenuCategory } from '../types';
import { subscribeToMenus } from '../services/menuService';

interface MenuPageProps {
  onCartClick: () => void;
  onOrderHistoryClick: () => void;
  onBackToMain: () => void;
}

const MenuPage = ({ onCartClick, onOrderHistoryClick, onBackToMain }: MenuPageProps) => {
  const { user, logoutUser } = useAuth();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  
  const { addToCart, getTotalItems, getTotalPrice } = useCartStore();

  // 메인 컬러
  const MAIN_COLOR = '#204031';
  const MAIN_LIGHT = '#2D5A45';
  const MAIN_LIGHTER = '#E8F0EC';

  // Firestore에서 메뉴 실시간 구독
  useEffect(() => {
    const unsubscribe = subscribeToMenus((menuList) => {
      setMenus(menuList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 카테고리 필터링
  const filteredMenus = selectedCategory === 'all'
    ? menus
    : menus.filter((menu) => menu.category === selectedCategory);

  // 장바구니에 추가
  const handleAddToCart = (menu: MenuItem) => {
    addToCart(menu, 1);
    setAddedItem(menu.id);
    setTimeout(() => setAddedItem(null), 1000);
  };

  // 가격 포맷
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  // 로그아웃
  const handleLogout = async () => {
    await logoutUser();
    onBackToMain();
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F9F9F9',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* 뒤로가기 */}
            <button
              onClick={onBackToMain}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: MAIN_COLOR,
                padding: '0.25rem'
              }}
            >
              ←
            </button>
            
            {/* 로고 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: MAIN_COLOR,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/>
                  <line x1="6" y1="2" x2="6" y2="4"/>
                  <line x1="10" y1="2" x2="10" y2="4"/>
                  <line x1="14" y1="2" x2="14" y2="4"/>
                </svg>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: MAIN_COLOR }}>
                ORDER
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* 주문내역 버튼 */}
            <button
              onClick={onOrderHistoryClick}
              style={{
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = MAIN_LIGHTER;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title="주문내역"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={MAIN_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </button>

            {/* 장바구니 버튼 */}
            <button
              onClick={onCartClick}
              style={{
                position: 'relative',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = MAIN_LIGHTER;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={MAIN_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {getTotalItems() > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: MAIN_COLOR,
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* 사용자 정보 */}
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="프로필"
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%',
                      border: `2px solid ${MAIN_LIGHTER}`
                    }}
                  />
                ) : (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: MAIN_COLOR,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    border: '1px solid #E0E0E0',
                    borderRadius: '2rem',
                    fontSize: '0.8rem',
                    color: '#666',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', paddingBottom: '7rem' }}>
        <h1 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '700', 
          marginBottom: '1.5rem',
          color: '#1E1E1E'
        }}>
          Menu
        </h1>

        {/* 카테고리 탭 */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #E0E0E0'
        }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '2rem',
              border: 'none',
              backgroundColor: selectedCategory === 'all' ? MAIN_COLOR : 'white',
              color: selectedCategory === 'all' ? 'white' : '#666',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: selectedCategory === 'all' ? 'none' : '0 1px 3px rgba(0,0,0,0.08)'
            }}
          >
            전체
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '2rem',
                border: 'none',
                backgroundColor: selectedCategory === category.id ? MAIN_COLOR : 'white',
                color: selectedCategory === category.id ? 'white' : '#666',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: selectedCategory === category.id ? 'none' : '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {/* 로딩 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: `3px solid ${MAIN_LIGHTER}`,
              borderTopColor: MAIN_COLOR,
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ marginTop: '1rem', color: '#888' }}>메뉴를 불러오는 중...</p>
          </div>
        ) : filteredMenus.length === 0 ? (
          /* 메뉴 없음 */
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</p>
            <p style={{ color: '#888', fontSize: '1.125rem' }}>등록된 메뉴가 없습니다</p>
          </div>
        ) : (
          /* 메뉴 목록 */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}>
            {filteredMenus.map((menu) => (
              <div
                key={menu.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* 메뉴 이미지 */}
                <div style={{
                  height: '160px',
                  backgroundColor: MAIN_LIGHTER,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  {menu.imageUrl ? (
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '4rem' }}>
                      {CATEGORIES.find((c) => c.id === menu.category)?.icon || '☕'}
                    </span>
                  )}
                  
                  {!menu.isAvailable && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '1.25rem'
                    }}>
                      SOLD OUT
                    </div>
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
                    {CATEGORIES.find((c) => c.id === menu.category)?.name}
                  </p>
                  <h3 style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#1E1E1E' }}>
                    {menu.name}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#888',
                    marginBottom: '1rem',
                    lineHeight: 1.4
                  }}>
                    {menu.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: '700', color: MAIN_COLOR, fontSize: '1.125rem' }}>
                      {formatPrice(menu.price)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(menu)}
                      disabled={!menu.isAvailable}
                      style={{
                        padding: '0.625rem 1.25rem',
                        backgroundColor: addedItem === menu.id 
                          ? '#4CAF50' 
                          : menu.isAvailable ? MAIN_COLOR : '#E0E0E0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '2rem',
                        fontWeight: '600',
                        cursor: menu.isAvailable ? 'pointer' : 'not-allowed',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {addedItem === menu.id ? '✓ 담김' : menu.isAvailable ? '담기' : '품절'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 하단 장바구니 바 */}
      {getTotalItems() > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: MAIN_COLOR,
          color: 'white',
          padding: '1rem 1.5rem',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.15)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontWeight: '600', fontSize: '1rem' }}>
                🛒 {getTotalItems()}개 상품
              </span>
              <span style={{ marginLeft: '1rem', fontSize: '1.125rem', fontWeight: '700' }}>
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <button 
              onClick={onCartClick}
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: 'white',
                color: MAIN_COLOR,
                border: 'none',
                borderRadius: '2rem',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              주문하기
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MenuPage;