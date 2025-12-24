import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, signInWithGoogle, logout } from '../services/authService';
import { subscribeToCart } from '../services/cartService';
import { useCartStore } from '../store/useStore';

// Context 타입 정의
interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logoutUser: () => Promise<void>;
}

// Context 생성
const AuthContext = createContext<AuthContextType | null>(null);

// Provider 컴포넌트
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { setUserId, setItems, setLoading: setCartLoading } = useCartStore();

  useEffect(() => {
    // Firebase 인증 상태 감시
    const unsubscribeAuth = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
      
      // 장바구니 연동
      if (user) {
        setUserId(user.uid);
        setCartLoading(true);
        
        // 장바구니 실시간 구독
        const unsubscribeCart = subscribeToCart(user.uid, (items) => {
          setItems(items);
          setCartLoading(false);
        });
        
        // 클린업에 장바구니 구독 해제 추가
        return () => {
          unsubscribeCart();
        };
      } else {
        // 로그아웃 시 장바구니 초기화
        setUserId(null);
        setItems([]);
        setCartLoading(false);
      }
    });

    // 클린업
    return () => unsubscribeAuth();
  }, [setUserId, setItems, setCartLoading]);

  // Google 로그인
  const loginWithGoogle = async () => {
    try {
      const { user, error } = await signInWithGoogle();
      if (error) {
        console.error('로그인 실패:', error);
        throw error;
      }
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.error('Google 로그인 에러:', error);
      throw error;
    }
  };

  // 로그아웃
  const logoutUser = async () => {
    try {
      const { error } = await logout();
      if (error) {
        console.error('로그아웃 실패:', error);
        throw error;
      }
      setUser(null);
      // 장바구니 초기화
      setUserId(null);
      setItems([]);
    } catch (error) {
      console.error('로그아웃 에러:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
