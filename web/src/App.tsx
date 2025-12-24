import { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';

// 페이지 타입
type Page = 'menu' | 'cart';

// 메인 콘텐츠 (로그인 상태에 따라 분기)
const MainContent = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('menu');

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

  // 로그인 안됐으면 로그인 페이지
  if (!user) {
    return <LoginPage />;
  }

  // 로그인 됐으면 페이지 네비게이션
  switch (currentPage) {
    case 'cart':
      return (
        <CartPage 
          onBack={() => setCurrentPage('menu')}
          onOrder={() => {
            alert('주문 기능은 다음 단계에서 구현됩니다!');
          }}
        />
      );
    case 'menu':
    default:
      return (
        <MenuPage 
          onCartClick={() => setCurrentPage('cart')}
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
