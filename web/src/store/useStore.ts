import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem } from '../types';

interface CartStore {
  // 상태
  items: CartItem[];
  
  // 액션
  addToCart: (menuItem: MenuItem, quantity?: number) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // 계산된 값
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // 장바구니에 추가
      addToCart: (menuItem: MenuItem, quantity: number = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.menuItem.id === menuItem.id
          );

          if (existingItem) {
            // 이미 있으면 수량 증가
            return {
              items: state.items.map((item) =>
                item.menuItem.id === menuItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          } else {
            // 없으면 새로 추가
            return {
              items: [...state.items, { menuItem, quantity }],
            };
          }
        });
      },

      // 장바구니에서 제거
      removeFromCart: (menuItemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.menuItem.id !== menuItemId),
        }));
      },

      // 수량 변경
      updateQuantity: (menuItemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(menuItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.menuItem.id === menuItemId ? { ...item, quantity } : item
          ),
        }));
      },

      // 장바구니 비우기
      clearCart: () => {
        set({ items: [] });
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
    }),
    {
      name: 'cafe-cart-storage', // localStorage 키
    }
  )
);
