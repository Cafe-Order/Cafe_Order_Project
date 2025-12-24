import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';

// 메인 콘텐츠 (로그인 상태에 따라 분기)
const MainContent = () => {
  const { user, loading } = useAuth();

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

  // 로그인 안됐으면 로그인 페이지, 됐으면 메뉴 페이지
  return user ? <MenuPage /> : <LoginPage />;
};

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
