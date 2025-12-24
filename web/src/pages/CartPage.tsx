import { useCartStore } from '../store/useStore';
import { CATEGORIES } from '../types';

interface CartPageProps {
  onBack: () => void;
  onOrder: () => void;
}

const CartPage = ({ onBack, onOrder }: CartPageProps) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCartStore();

  // 메인 컬러
  const MAIN_COLOR = '#204031';
  const MAIN_LIGHTER = '#E8F0EC';

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
              padding: '0.5rem',
              color: MAIN_COLOR
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1E1E1E' }}>
            장바구니
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
        {items.length === 0 ? (
          /* 장바구니 비어있음 */
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: MAIN_LIGHTER,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '3rem'
            }}>
              🛒
            </div>
            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '1.125rem' }}>
              장바구니가 비어있습니다
            </p>
            <button
              onClick={onBack}
              style={{
                padding: '1rem 2rem',
                backgroundColor: MAIN_COLOR,
                color: 'white',
                border: 'none',
                borderRadius: '2rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem'
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
                  color: '#E53935',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontWeight: '500'
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
                    padding: '1.25rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    display: 'flex',
                    gap: '1rem'
                  }}
                >
                  {/* 아이템 이미지 */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: MAIN_LIGHTER,
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
                      <span style={{ fontSize: '2rem' }}>
                        {CATEGORIES.find((c) => c.id === item.menuItem.category)?.icon || '☕'}
                      </span>
                    )}
                  </div>

                  {/* 아이템 정보 */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontWeight: '600', color: '#1E1E1E' }}>{item.menuItem.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.menuItem.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#CCC',
                          cursor: 'pointer',
                          fontSize: '1.5rem',
                          lineHeight: 1
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                      {formatPrice(item.menuItem.price)}
                    </p>

                    {/* 수량 조절 */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                          onClick={() => handleQuantityChange(item.menuItem.id, -1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: `1px solid #E0E0E0`,
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            fontSize: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#666'
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
                            border: `1px solid ${MAIN_COLOR}`,
                            backgroundColor: MAIN_COLOR,
                            cursor: 'pointer',
                            fontSize: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                          }}
                        >
                          +
                        </button>
                      </div>
                      <span style={{ fontWeight: '700', color: MAIN_COLOR, fontSize: '1.125rem' }}>
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
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              marginBottom: '7rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '1rem',
                borderBottom: '1px solid #E0E0E0',
                marginBottom: '1rem'
              }}>
                <span style={{ color: '#666' }}>상품 금액</span>
                <span style={{ fontWeight: '600' }}>{formatPrice(getTotalPrice())}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: '700', fontSize: '1.125rem' }}>총 결제 금액</span>
                <span style={{ fontWeight: '700', color: MAIN_COLOR, fontSize: '1.5rem' }}>
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
          padding: '1rem 1.5rem',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.08)'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button
              onClick={onOrder}
              style={{
                width: '100%',
                padding: '1.125rem',
                backgroundColor: MAIN_COLOR,
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1.125rem',
                fontWeight: '700',
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