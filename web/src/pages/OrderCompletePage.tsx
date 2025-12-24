import { useEffect, useState } from 'react';
import { Order } from '../types';
import { subscribeToOrder } from '../services/orderService';

interface OrderCompletePageProps {
  orderId: string;
  onBackToMenu: () => void;
}

// 주문 상태 한글 변환
const STATUS_MAP: Record<string, { text: string; color: string; bg: string }> = {
  pending: { text: '주문 접수 중', color: '#F57C00', bg: '#FFF3E0' },
  confirmed: { text: '주문 확인', color: '#1976D2', bg: '#E3F2FD' },
  preparing: { text: '음료 준비 중', color: '#7B1FA2', bg: '#F3E5F5' },
  ready: { text: '픽업 대기', color: '#388E3C', bg: '#E8F5E9' },
  completed: { text: '수령 완료', color: '#616161', bg: '#F5F5F5' },
  cancelled: { text: '주문 취소', color: '#D32F2F', bg: '#FFEBEE' },
};

const OrderCompletePage = ({ orderId, onBackToMenu }: OrderCompletePageProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // 메인 컬러
  const MAIN_COLOR = '#204031';
  const MAIN_LIGHTER = '#E8F0EC';

  // 주문 실시간 구독
  useEffect(() => {
    const unsubscribe = subscribeToOrder(orderId, (orderData) => {
      setOrder(orderData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  // 가격 포맷
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
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
          border: `3px solid ${MAIN_LIGHTER}`,
          borderTopColor: MAIN_COLOR,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9F9F9',
        padding: '1rem'
      }}>
        <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</p>
        <p style={{ color: '#888', marginBottom: '2rem' }}>주문을 찾을 수 없습니다</p>
        <button
          onClick={onBackToMenu}
          style={{
            padding: '1rem 2rem',
            backgroundColor: MAIN_COLOR,
            color: 'white',
            border: 'none',
            borderRadius: '2rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          메뉴로 돌아가기
        </button>
      </div>
    );
  }

  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;

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
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1E1E1E' }}>
            주문 상세
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
        
        {/* 성공 메시지 */}
        <div style={{ 
          textAlign: 'center', 
          padding: '2.5rem 1rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '1rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: MAIN_LIGHTER,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem'
          }}>
            ✅
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1E1E1E' }}>
            주문이 완료되었습니다!
          </h2>
          <p style={{ color: '#888' }}>
            주문번호: <span style={{ fontWeight: '600', color: MAIN_COLOR }}>
              {orderId.slice(-8).toUpperCase()}
            </span>
          </p>
        </div>

        {/* 주문 상태 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#888', marginBottom: '1rem', fontSize: '0.9rem' }}>현재 주문 상태</p>
          <div style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            backgroundColor: statusInfo.bg,
            color: statusInfo.color,
            borderRadius: '2rem',
            fontWeight: '700',
            fontSize: '1.125rem'
          }}>
            {statusInfo.text}
          </div>
          <p style={{ color: '#AAA', fontSize: '0.8rem', marginTop: '1rem' }}>
            상태가 실시간으로 업데이트됩니다
          </p>
        </div>

        {/* 주문 상세 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '1rem'
        }}>
          <h3 style={{ fontWeight: '700', marginBottom: '1rem', color: '#1E1E1E' }}>주문 내역</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '1rem',
                  borderBottom: index < order.items.length - 1 ? '1px solid #F0F0F0' : 'none'
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
          <hr style={{ border: 'none', borderTop: '1px solid #E0E0E0', margin: '1rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem' }}>
            <span style={{ fontWeight: '700' }}>총 결제 금액</span>
            <span style={{ fontWeight: '700', color: MAIN_COLOR }}>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>

        {/* 주문 시간 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
            <span>주문 시간</span>
            <span>
              {order.createdAt.toLocaleDateString('ko-KR')} {order.createdAt.toLocaleTimeString('ko-KR')}
            </span>
          </div>
        </div>

        {/* 버튼 */}
        <button
          onClick={onBackToMenu}
          style={{
            width: '100%',
            padding: '1.125rem',
            backgroundColor: MAIN_COLOR,
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          메뉴로 돌아가기
        </button>
      </main>
    </div>
  );
};

export default OrderCompletePage;