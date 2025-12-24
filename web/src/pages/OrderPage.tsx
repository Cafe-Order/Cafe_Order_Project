import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCartStore } from '../store/useStore';
import { createOrder } from '../services/orderService';
import { CATEGORIES } from '../types';

interface OrderPageProps {
  onBack: () => void;
  onOrderComplete: (orderId: string) => void;
}

const OrderPage = ({ onBack, onOrderComplete }: OrderPageProps) => {
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState('');

  // 가격 포맷
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  // 주문 제출
  const handleSubmitOrder = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (items.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }

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
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>주문 확인</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 1rem', paddingBottom: '8rem' }}>
        
        {/* 주문 아이템 목록 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1rem'
        }}>
          <h2 style={{ fontWeight: '600', marginBottom: '1rem' }}>주문 내역</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <div
                key={item.menuItem.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #f3f4f6'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>
                    {CATEGORIES.find((c) => c.id === item.menuItem.category)?.icon || '☕'}
                  </span>
                  <div>
                    <p style={{ fontWeight: '500' }}>{item.menuItem.name}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {formatPrice(item.menuItem.price)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span style={{ fontWeight: '600', color: '#b45309' }}>
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
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1rem'
        }}>
          <h2 style={{ fontWeight: '600', marginBottom: '1rem' }}>요청사항</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="예: 얼음 적게, 시럽 추가 등"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              resize: 'none',
              height: '80px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* 결제 정보 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontWeight: '600', marginBottom: '1rem' }}>결제 정보</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
              <span>상품 금액</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
              <span>할인</span>
              <span>0원</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0.5rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 'bold' }}>
              <span>총 결제 금액</span>
              <span style={{ color: '#78350f' }}>{formatPrice(getTotalPrice())}</span>
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
        padding: '1rem',
        boxShadow: '0 -4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button
            onClick={handleSubmitOrder}
            disabled={isSubmitting || items.length === 0}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: isSubmitting ? '#d1d5db' : '#78350f',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? '주문 중...' : `${formatPrice(getTotalPrice())} 결제하기`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
