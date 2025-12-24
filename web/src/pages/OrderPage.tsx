import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCartStore } from '../store/useStore';
import { createOrder } from '../services/orderService';

interface OrderPageProps {
  onBack: () => void;
  onOrderComplete: (orderId: string) => void;
}

const OrderPage = ({ onBack, onOrderComplete }: OrderPageProps) => {
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [request, setRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 메인 컬러
  const MAIN_COLOR = '#204031';
  const MAIN_LIGHTER = '#E8F0EC';

  // 가격 포맷
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  // 주문 제출
  const handleSubmitOrder = async () => {
    if (!user || items.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderId = await createOrder(user.uid, items, getTotalPrice());
      clearCart();
      onOrderComplete(orderId);
    } catch (error) {
      console.error('주문 실패:', error);
      alert('주문에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
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
            주문 확인
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
        {/* 주문 내역 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '1rem'
        }}>
          <h2 style={{ fontWeight: '700', marginBottom: '1rem', color: '#1E1E1E' }}>
            주문 내역
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '1rem',
                  borderBottom: index < items.length - 1 ? '1px solid #F0F0F0' : 'none'
                }}
              >
                <div>
                  <p style={{ fontWeight: '600', color: '#1E1E1E' }}>{item.menuItem.name}</p>
                  <p style={{ fontSize: '0.875rem', color: '#888', marginTop: '0.25rem' }}>
                    {formatPrice(item.menuItem.price)} × {item.quantity}
                  </p>
                </div>
                <span style={{ fontWeight: '600', color: MAIN_COLOR }}>
                  {formatPrice(item.menuItem.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 요청사항 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '1rem'
        }}>
          <h2 style={{ fontWeight: '700', marginBottom: '1rem', color: '#1E1E1E' }}>
            요청사항
          </h2>
          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="예) 얼음 적게, 시럽 추가 등"
            style={{
              width: '100%',
              padding: '1rem',
              border: '1px solid #E0E0E0',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              resize: 'none',
              height: '100px',
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = MAIN_COLOR}
            onBlur={(e) => e.currentTarget.style.borderColor = '#E0E0E0'}
          />
        </div>

        {/* 결제 정보 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '7rem'
        }}>
          <h2 style={{ fontWeight: '700', marginBottom: '1rem', color: '#1E1E1E' }}>
            결제 정보
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>상품 금액</span>
              <span style={{ fontWeight: '500' }}>{formatPrice(getTotalPrice())}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>할인 금액</span>
              <span style={{ fontWeight: '500', color: '#E53935' }}>-0원</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #F0F0F0', margin: '0.5rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '700', fontSize: '1.125rem' }}>총 결제 금액</span>
              <span style={{ fontWeight: '700', color: MAIN_COLOR, fontSize: '1.5rem' }}>
                {formatPrice(getTotalPrice())}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* 하단 결제 버튼 */}
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
            onClick={handleSubmitOrder}
            disabled={isSubmitting || items.length === 0}
            style={{
              width: '100%',
              padding: '1.125rem',
              backgroundColor: isSubmitting ? '#A5D6A7' : MAIN_COLOR,
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1.125rem',
              fontWeight: '700',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? '주문 처리 중...' : `${formatPrice(getTotalPrice())} 결제하기`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;