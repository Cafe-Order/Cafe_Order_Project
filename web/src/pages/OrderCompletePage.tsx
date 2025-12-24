import { useEffect, useState } from 'react';
import { Order } from '../types';
import { subscribeToOrder } from '../services/orderService';

interface OrderCompletePageProps {
  orderId: string;
  onBackToMenu: () => void;
}

// 주문 상태 한글 변환
const STATUS_MAP: Record<string, { text: string; color: string; bg: string }> = {
  pending: { text: '주문 접수 중', color: '#ca8a04', bg: '#fef9c3' },
  confirmed: { text: '주문 확인', color: '#2563eb', bg: '#dbeafe' },
  preparing: { text: '준비 중', color: '#ea580c', bg: '#ffedd5' },
  ready: { text: '준비 완료', color: '#16a34a', bg: '#dcfce7' },
  completed: { text: '수령 완료', color: '#6b7280', bg: '#f3f4f6' },
  cancelled: { text: '주문 취소', color: '#dc2626', bg: '#fee2e2' },
};

const OrderCompletePage = ({ orderId, onBackToMenu }: OrderCompletePageProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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
        backgroundColor: '#faf9f7'
      }}>
        <p>주문 정보를 불러오는 중...</p>
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
        backgroundColor: '#faf9f7',
        padding: '1rem'
      }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</p>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>주문을 찾을 수 없습니다</p>
        <button
          onClick={onBackToMenu}
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
          메뉴로 돌아가기
        </button>
      </div>
    );
  }

  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;

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
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>주문 완료</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        
        {/* 성공 메시지 */}
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            주문이 완료되었습니다!
          </h2>
          <p style={{ color: '#6b7280' }}>
            주문번호: {orderId.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* 주문 상태 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6b7280', marginBottom: '0.75rem' }}>현재 주문 상태</p>
          <span style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            backgroundColor: statusInfo.bg,
            color: statusInfo.color,
            borderRadius: '2rem',
            fontWeight: '600',
            fontSize: '1.125rem'
          }}>
            {statusInfo.text}
          </span>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '1rem' }}>
            상태가 실시간으로 업데이트됩니다
          </p>
        </div>

        {/* 주문 상세 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1rem'
        }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>주문 내역</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {order.items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid #f3f4f6'
                }}
              >
                <div>
                  <p style={{ fontWeight: '500' }}>{item.menuItem.name}</p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {formatPrice(item.menuItem.price)} × {item.quantity}
                  </p>
                </div>
                <span style={{ fontWeight: '600', color: '#b45309' }}>
                  {formatPrice(item.menuItem.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 'bold' }}>
            <span>총 결제 금액</span>
            <span style={{ color: '#78350f' }}>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>

        {/* 주문 시간 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
            <span>주문 시간</span>
            <span>
              {order.createdAt.toLocaleDateString('ko-KR')} {order.createdAt.toLocaleTimeString('ko-KR')}
            </span>
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={onBackToMenu}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#78350f',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            추가 주문하기
          </button>
          <button
            onClick={onBackToMenu}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            메뉴로 돌아가기
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrderCompletePage;
