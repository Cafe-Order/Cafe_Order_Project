import { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import OrderCompletePage from './pages/OrderCompletePage';
import OrderHistoryPage from './pages/OrderHistoryPage';

// 페이지 타입
type Page = 'main' | 'login' | 'menu' | 'cart' | 'order' | 'orderComplete' | 'orderHistory';

// 메인 콘텐츠
const MainContent = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('main');
  const [completedOrderId, setCompletedOrderId] = useState<string>('');

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#faf9f7'
      }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  // 페이지 네비게이션
  switch (currentPage) {
    case 'login':
      return (
        <LoginPage 
          onLoginSuccess={() => setCurrentPage('menu')}
          onBack={() => setCurrentPage('main')}
        />
      );

    case 'menu':
      // 로그인 안됐으면 로그인 페이지로
      if (!user) {
        return (
          <LoginPage 
            onLoginSuccess={() => setCurrentPage('menu')}
            onBack={() => setCurrentPage('main')}
          />
        );
      }
      return (
        <MenuPage 
          onCartClick={() => setCurrentPage('cart')}
          onOrderHistoryClick={() => setCurrentPage('orderHistory')}
          onBackToMain={() => setCurrentPage('main')}
        />
      );
    
    case 'cart':
      return (
        <CartPage 
          onBack={() => setCurrentPage('menu')}
          onOrder={() => setCurrentPage('order')}
        />
      );
    
    case 'order':
      return (
        <OrderPage
          onBack={() => setCurrentPage('cart')}
          onOrderComplete={(orderId) => {
            setCompletedOrderId(orderId);
            setCurrentPage('orderComplete');
          }}
        />
      );
    
    case 'orderComplete':
      return (
        <OrderCompletePage
          orderId={completedOrderId}
          onBackToMenu={() => setCurrentPage('menu')}
        />
      );
    
    case 'orderHistory':
      return (
        <OrderHistoryPage
          onBack={() => setCurrentPage('menu')}
          onOrderDetail={(orderId) => {
            setCompletedOrderId(orderId);
            setCurrentPage('orderComplete');
          }}
        />
      );
    
    case 'main':
    default:
      return (
        <MainPage 
          onOrderClick={() => setCurrentPage(user ? 'menu' : 'login')}
          onLoginClick={() => setCurrentPage('login')}
        />
      );
  }
};

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
