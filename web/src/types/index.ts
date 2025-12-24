// 메뉴 카테고리 타입
export type MenuCategory = 'coffee' | 'beverage' | 'bakery';

// 카테고리 목록 (디저트 제거)
export const CATEGORIES: { id: MenuCategory; name: string; icon: string }[] = [
  { id: 'coffee', name: '커피', icon: '☕' },
  { id: 'beverage', name: '음료', icon: '🧃' },
  { id: 'bakery', name: '베이커리', icon: '🥐' },
];

// 메뉴 아이템 타입
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: Date;
}

// 장바구니 아이템 타입
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

// 주문 상태 타입
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

// 주문 타입
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  request?: string;
}