import { AuthProvider } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}

export default App;
