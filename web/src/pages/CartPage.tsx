import { useCartStore } from '../store/useStore';
import { CATEGORIES } from '../types';

interface CartPageProps {
  onBack: () => void;
  onOrder: () => void;
}

const CartPage = ({ onBack, onOrder }: CartPageProps) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCartStore();

  // 가격 포맷
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  // 수량 변경
  const handleQuantityChange = (menuItemId: string, delta: number) => {
    const item = items.find((i) => i.menuItem.id === menuItemId);
    if (item) {
      const newQuantity = item.quantity + delta;
      updateQuantity(menuItemId, newQuantity);
    }
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
          alignItems: 'center',
          gap: '1rem'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>장바구니</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {items.length === 0 ? (
          /* 장바구니 비어있음 */
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</p>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>장바구니가 비어있습니다</p>
            <button
              onClick={onBack}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#78350f',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              메뉴 보러가기
            </button>
          </div>
        ) : (
          <>
            {/* 전체 삭제 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button
                onClick={clearCart}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                전체 삭제
              </button>
            </div>

            {/* 장바구니 아이템 목록 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {items.map((item) => (
                <div
                  key={item.menuItem.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    padding: '1rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    display: 'flex',
                    gap: '1rem'
                  }}
                >
                  {/* 아이템 이미지 */}
                  <div style={{
                    width: '70px',
                    height: '70px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {item.menuItem.imageUrl ? (
                      <img
                        src={item.menuItem.imageUrl}
                        alt={item.menuItem.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '0.75rem'
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '1.75rem' }}>
                        {CATEGORIES.find((c) => c.id === item.menuItem.category)?.icon || '☕'}
                      </span>
                    )}
                  </div>

                  {/* 아이템 정보 */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontWeight: '600' }}>{item.menuItem.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.menuItem.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          fontSize: '1.25rem'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {formatPrice(item.menuItem.price)}
                    </p>

                    {/* 수량 조절 */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                          onClick={() => handleQuantityChange(item.menuItem.id, -1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: '#f3f4f6',
                            cursor: 'pointer',
                            fontSize: '1.25rem'
                          }}
                        >
                          −
                        </button>
                        <span style={{ fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.menuItem.id, 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: '#f3f4f6',
                            cursor: 'pointer',
                            fontSize: '1.25rem'
                          }}
                        >
                          +
                        </button>
                      </div>
                      <span style={{ fontWeight: 'bold', color: '#b45309' }}>
                        {formatPrice(item.menuItem.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 주문 요약 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '6rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '1.125rem'
              }}>
                <span style={{ fontWeight: '500', color: '#4b5563' }}>총 금액</span>
                <span style={{ fontWeight: 'bold', color: '#78350f', fontSize: '1.25rem' }}>
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
            </div>
          </>
        )}
      </main>

      {/* 하단 주문 버튼 */}
      {items.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          padding: '1rem',
          boxShadow: '0 -4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button
              onClick={onOrder}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#78350f',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {formatPrice(getTotalPrice())} 주문하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;