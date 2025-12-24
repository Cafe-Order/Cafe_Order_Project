import { useEffect, useState } from 'react';
import { auth, db } from './services/firebase';
import { collection, getDocs } from 'firebase/firestore';

function App() {
  const [firebaseStatus, setFirebaseStatus] = useState<string>('확인 중...');
  const [firestoreStatus, setFirestoreStatus] = useState<string>('확인 중...');

  useEffect(() => {
    // Firebase Auth 연결 확인
    try {
      const appName = auth.app.name;
      setFirebaseStatus(`✅ 연결됨 (${appName})`);
    } catch (error) {
      setFirebaseStatus(`❌ 연결 실패: ${error}`);
    }

    // Firestore 연결 확인
    const checkFirestore = async () => {
      try {
        // 테스트용 컬렉션 조회 시도
        await getDocs(collection(db, 'test'));
        setFirestoreStatus('✅ Firestore 연결됨');
      } catch (error: any) {
        // permission-denied는 연결은 됐지만 권한 문제
        if (error.code === 'permission-denied') {
          setFirestoreStatus('✅ Firestore 연결됨 (권한 설정 필요)');
        } else {
          setFirestoreStatus(`❌ 연결 실패: ${error.message}`);
        }
      }
    };

    checkFirestore();
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#faf9f7',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          ☕ 카페 오더 - Firebase 연결 테스트
        </h1>
        
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Firebase Auth:</p>
          <p style={{ 
            padding: '0.75rem', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '0.5rem' 
          }}>
            {firebaseStatus}
          </p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Firestore Database:</p>
          <p style={{ 
            padding: '0.75rem', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '0.5rem' 
          }}>
            {firestoreStatus}
          </p>
        </div>

        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          backgroundColor: '#fef3c7', 
          borderRadius: '0.5rem',
          fontSize: '0.875rem'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📌 다음 단계:</p>
          <p>연결이 확인되면 Git에 커밋하고 다음 단계로 진행하세요!</p>
        </div>
      </div>
    </div>
  );
}

export default App;