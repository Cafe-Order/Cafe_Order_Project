import { create } from 'zustand';
import { CartItem, MenuItem } from '../types';
import { saveCart, clearCartInFirebase } from '../services/cartService';

interface CartStore {
  // 상태
  items: CartItem[];
  userId: string | null;
  isLoading: boolean;
  
  // 초기화 (로그인 시 호출)
  setUserId: (userId: string | null) => void;
  setItems: (items: CartItem[]) => void;
  setLoading: (loading: boolean) => void;
  
  // 액션
  addToCart: (menuItem: MenuItem, quantity?: number) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // 계산된 값
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  userId: null,
  isLoading: true,

  // 사용자 ID 설정
  setUserId: (userId) => set({ userId }),
  
  // 아이템 설정 (Firebase에서 불러온 데이터)
  setItems: (items) => set({ items }),
  
  // 로딩 상태 설정
  setLoading: (isLoading) => set({ isLoading }),

  // 장바구니에 추가
  addToCart: (menuItem: MenuItem, quantity: number = 1) => {
    const { items, userId } = get();
    
    const existingItem = items.find(
      (item) => item.menuItem.id === menuItem.id
    );

    let newItems: CartItem[];
    
    if (existingItem) {
      // 이미 있으면 수량 증가
      newItems = items.map((item) =>
        item.menuItem.id === menuItem.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // 없으면 새로 추가
      newItems = [...items, { menuItem, quantity }];
    }
    
    set({ items: newItems });
    
    // Firebase에 저장
    if (userId) {
      saveCart(userId, newItems).catch(console.error);
    }
  },

  // 장바구니에서 제거
  removeFromCart: (menuItemId: string) => {
    const { items, userId } = get();
    const newItems = items.filter((item) => item.menuItem.id !== menuItemId);
    
    set({ items: newItems });
    
    // Firebase에 저장
    if (userId) {
      saveCart(userId, newItems).catch(console.error);
    }
  },

  // 수량 변경
  updateQuantity: (menuItemId: string, quantity: number) => {
    const { items, userId } = get();
    
    if (quantity <= 0) {
      get().removeFromCart(menuItemId);
      return;
    }

    const newItems = items.map((item) =>
      item.menuItem.id === menuItemId ? { ...item, quantity } : item
    );
    
    set({ items: newItems });
    
    // Firebase에 저장
    if (userId) {
      saveCart(userId, newItems).catch(console.error);
    }
  },

  // 장바구니 비우기
  clearCart: () => {
    const { userId } = get();
    
    set({ items: [] });
    
    // Firebase에서 삭제
    if (userId) {
      clearCartInFirebase(userId).catch(console.error);
    }
  },

  // 총 가격 계산
  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    );
  },

  // 총 아이템 수 계산
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
