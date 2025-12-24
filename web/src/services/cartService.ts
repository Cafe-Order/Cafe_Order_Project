import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { CartItem } from '../types';

// 사용자별 장바구니 문서 참조
const getCartRef = (userId: string) => doc(db, 'carts', userId);

// 장바구니 가져오기
export const getCart = async (userId: string): Promise<CartItem[]> => {
  try {
    const cartDoc = await getDoc(getCartRef(userId));
    if (cartDoc.exists()) {
      return cartDoc.data().items || [];
    }
    return [];
  } catch (error) {
    console.error('장바구니 조회 실패:', error);
    return [];
  }
};

// 장바구니 저장 (전체 업데이트)
export const saveCart = async (userId: string, items: CartItem[]): Promise<void> => {
  try {
    await setDoc(getCartRef(userId), {
      items,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('장바구니 저장 실패:', error);
    throw error;
  }
};

// 장바구니 비우기
export const clearCartInFirebase = async (userId: string): Promise<void> => {
  try {
    await deleteDoc(getCartRef(userId));
  } catch (error) {
    console.error('장바구니 삭제 실패:', error);
    throw error;
  }
};

// 장바구니 실시간 구독
export const subscribeToCart = (
  userId: string,
  callback: (items: CartItem[]) => void
) => {
  return onSnapshot(getCartRef(userId), (doc) => {
    if (doc.exists()) {
      callback(doc.data().items || []);
    } else {
      callback([]);
    }
  });
};
