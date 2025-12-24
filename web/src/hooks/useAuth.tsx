import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, signInWithGoogle, logout } from '../services/authService';

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

  useEffect(() => {
    // Firebase 인증 상태 감시
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // 클린업
    return () => unsubscribe();
  }, []);

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
