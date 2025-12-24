import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCartStore } from '../store/useStore';
import { MenuItem, CATEGORIES, MenuCategory } from '../types';
import { subscribeToMenus } from '../services/menuService';

interface MenuPageProps {
  onCartClick: () => void;
}

const MenuPage = ({ onCartClick }: MenuPageProps) => {
  const { user, logoutUser } = useAuth();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  
  const { addToCart, getTotalItems, getTotalPrice } = useCartStore();

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
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#faf9f7',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* 헤더 */}
      <header style={{
        backgroundColor: 'white',
        padding: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>☕</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#78350f' }}>
              카페 오더
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* 장바구니 버튼 */}
            <button
              onClick={onCartClick}
              style={{
                position: 'relative',
                padding: '0.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem'
              }}
            >
              🛒
              {getTotalItems() > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: '#dc2626',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  width: '20px',
                  height: '20px',
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
                    style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                  />
                ) : (
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#78350f',
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
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
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
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 1rem', paddingBottom: '6rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          메뉴
        </h1>

        {/* 카테고리 탭 */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          marginBottom: '1rem'
        }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              border: 'none',
              backgroundColor: selectedCategory === 'all' ? '#78350f' : '#f3f4f6',
              color: selectedCategory === 'all' ? 'white' : '#4b5563',
              fontWeight: '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            전체
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                border: 'none',
                backgroundColor: selectedCategory === category.id ? '#78350f' : '#f3f4f6',
                color: selectedCategory === category.id ? 'white' : '#4b5563',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {/* 로딩 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>메뉴를 불러오는 중...</p>
          </div>
        ) : filteredMenus.length === 0 ? (
          /* 메뉴 없음 */
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
            <p style={{ color: '#6b7280' }}>등록된 메뉴가 없습니다</p>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Firestore에 메뉴 데이터를 추가해주세요
            </p>
          </div>
        ) : (
          /* 메뉴 목록 */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {filteredMenus.map((menu) => (
              <div
                key={menu.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  display: 'flex',
                  gap: '1rem'
                }}
              >
                {/* 메뉴 이미지 */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {menu.imageUrl ? (
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '0.75rem'
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '2rem' }}>
                      {CATEGORIES.find((c) => c.id === menu.category)?.icon || '☕'}
                    </span>
                  )}
                </div>

                {/* 메뉴 정보 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    {menu.name}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '0.5rem',
                    flex: 1
                  }}>
                    {menu.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: 'bold', color: '#b45309' }}>
                      {formatPrice(menu.price)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(menu)}
                      disabled={!menu.isAvailable}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: addedItem === menu.id 
                          ? '#16a34a' 
                          : menu.isAvailable ? '#78350f' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '500',
                        cursor: menu.isAvailable ? 'pointer' : 'not-allowed',
                        fontSize: '0.875rem',
                        transition: 'background-color 0.2s'
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
          backgroundColor: '#78350f',
          color: 'white',
          padding: '1rem',
          boxShadow: '0 -4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontWeight: '600' }}>🛒 {getTotalItems()}개 상품</span>
              <span style={{ marginLeft: '1rem' }}>{formatPrice(getTotalPrice())}</span>
            </div>
            <button 
              onClick={onCartClick}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                color: '#78350f',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              장바구니 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;