import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Order } from '../types';
import { subscribeToUserOrders } from '../services/orderService';

interface OrderHistoryPageProps {
  onBack: () => void;
  onOrderDetail: (orderId: string) => void;
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

const OrderHistoryPage = ({ onBack, onOrderDetail }: OrderHistoryPageProps) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 사용자 주문 내역 실시간 구독
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserOrders(user.uid, (orderList) => {
      console.log('주문 내역:', orderList); // 디버깅용
      setOrders(orderList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 가격 포맷
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  // 날짜 포맷
  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date)) return '날짜 없음';
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 주문 아이템에서 이름 안전하게 가져오기
  const getItemName = (item: any): string => {
    if (!item) return '알 수 없음';
    // menuItem.name 또는 name 직접 접근
    if (item.menuItem?.name) return item.menuItem.name;
    if (item.name) return item.name;
    return '알 수 없음';
  };

  // 주문 아이템 수량 가져오기
  const getItemQuantity = (item: any): number => {
    return item?.quantity || 1;
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
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>주문내역</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>주문내역을 불러오는 중...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</p>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>주문내역이 없습니다</p>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => {
              const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;
              
              // 안전하게 아이템 정보 가져오기
              const items = order.items || [];
              const itemCount = items.reduce((sum, item) => sum + getItemQuantity(item), 0);
              const firstItemName = items.length > 0 ? getItemName(items[0]) : '주문 상품';
              const displayName = items.length > 1 
                ? `${firstItemName} 외 ${items.length - 1}개`
                : firstItemName;

              return (
                <div
                  key={order.id}
                  onClick={() => onOrderDetail(order.id)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s'
                  }}
                >
                  {/* 상단: 날짜 & 상태 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem'
                  }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {formatDate(order.createdAt)}
                    </span>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: statusInfo.bg,
                      color: statusInfo.color,
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {statusInfo.text}
                    </span>
                  </div>

                  {/* 중앙: 주문 정보 */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ fontWeight: '600', fontSize: '1rem' }}>
                      {displayName}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      총 {itemCount}개 상품
                    </p>
                  </div>

                  {/* 하단: 가격 & 주문번호 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #f3f4f6'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span style={{ fontWeight: 'bold', color: '#78350f' }}>
                      {formatPrice(order.totalPrice || 0)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistoryPage;