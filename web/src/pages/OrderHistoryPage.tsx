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
  pending: { text: '주문 접수 중', color: '#F57C00', bg: '#FFF3E0' },
  confirmed: { text: '주문 확인', color: '#1976D2', bg: '#E3F2FD' },
  preparing: { text: '음료 준비 중', color: '#7B1FA2', bg: '#F3E5F5' },
  ready: { text: '픽업 대기', color: '#388E3C', bg: '#E8F5E9' },
  completed: { text: '수령 완료', color: '#616161', bg: '#F5F5F5' },
  cancelled: { text: '주문 취소', color: '#D32F2F', bg: '#FFEBEE' },
};

const OrderHistoryPage = ({ onBack, onOrderDetail }: OrderHistoryPageProps) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 메인 컬러
  const MAIN_COLOR = '#204031';
  const MAIN_LIGHTER = '#E8F0EC';

  // 사용자 주문 내역 실시간 구독
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserOrders(user.uid, (orderList) => {
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
            주문내역
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
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
            <p style={{ marginTop: '1rem', color: '#888' }}>주문내역을 불러오는 중...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : orders.length === 0 ? (
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
              📋
            </div>
            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '1.125rem' }}>
              주문내역이 없습니다
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => {
              const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;
              const items = order.items || [];
              const totalQuantity = items.reduce((sum, item) => sum + getItemQuantity(item), 0);

              return (
                <div
                  key={order.id}
                  onClick={() => onOrderDetail(order.id)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* 상단: 날짜 & 상태 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ color: '#888', fontSize: '0.875rem' }}>
                      {formatDate(order.createdAt)}
                    </span>
                    <span style={{
                      padding: '0.375rem 0.875rem',
                      backgroundColor: statusInfo.bg,
                      color: statusInfo.color,
                      borderRadius: '2rem',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {statusInfo.text}
                    </span>
                  </div>

                  {/* 중간: 주문 아이템 목록 */}
                  <div style={{ marginBottom: '1rem' }}>
                    {items.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                        borderBottom: idx < items.length - 1 ? '1px solid #F5F5F5' : 'none'
                      }}>
                        <span style={{ color: '#1E1E1E' }}>
                          {getItemName(item)}
                        </span>
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>
                          × {getItemQuantity(item)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 하단: 총 금액 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid #E0E0E0'
                  }}>
                    <span style={{ color: '#888', fontSize: '0.9rem' }}>
                      총 {totalQuantity}개 상품
                    </span>
                    <span style={{ fontWeight: '700', color: MAIN_COLOR, fontSize: '1.125rem' }}>
                      {formatPrice(order.totalPrice)}
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