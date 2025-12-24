import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { Order, OrderStatus, CartItem } from '../types';

const ORDER_COLLECTION = 'orders';

// Firestore 데이터를 Order로 변환
const convertToOrder = (doc: any): Order => {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    items: data.items,
    totalPrice: data.totalPrice,
    status: data.status,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

// 주문 생성
export const createOrder = async (
  userId: string,
  items: CartItem[],
  totalPrice: number
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, ORDER_COLLECTION), {
      userId,
      items: items.map(item => ({
        menuItem: {
          id: item.menuItem.id,
          name: item.menuItem.name,
          price: item.menuItem.price,
          category: item.menuItem.category,
          imageUrl: item.menuItem.imageUrl || '',
        },
        quantity: item.quantity,
        options: item.options || [],
      })),
      totalPrice,
      status: 'pending' as OrderStatus,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('주문 생성 실패:', error);
    throw error;
  }
};

// 사용자의 주문 내역 가져오기
export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, ORDER_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertToOrder);
  } catch (error) {
    console.error('주문 내역 조회 실패:', error);
    throw error;
  }
};

// 단일 주문 가져오기
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, ORDER_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return convertToOrder(docSnap);
    }
    return null;
  } catch (error) {
    console.error('주문 조회 실패:', error);
    throw error;
  }
};

// 주문 상태 업데이트
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  try {
    const docRef = doc(db, ORDER_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('주문 상태 업데이트 실패:', error);
    throw error;
  }
};

// 주문 실시간 감시 (모바일앱과 동기화용)
export const subscribeToOrder = (
  orderId: string,
  callback: (order: Order | null) => void
) => {
  const docRef = doc(db, ORDER_COLLECTION, orderId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(convertToOrder(doc));
    } else {
      callback(null);
    }
  });
};

// 사용자의 주문 실시간 감시
export const subscribeToUserOrders = (
  userId: string,
  callback: (orders: Order[]) => void
) => {
  const q = query(
    collection(db, ORDER_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(convertToOrder);
    callback(orders);
  });
};

// 모든 주문 실시간 감시 (관리자용)
export const subscribeToAllOrders = (callback: (orders: Order[]) => void) => {
  const q = query(
    collection(db, ORDER_COLLECTION),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(convertToOrder);
    callback(orders);
  });
};
