// 메뉴 카테고리
export type MenuCategory = 'coffee' | 'beverage' | 'dessert' | 'bakery';

// 메뉴 아이템
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

// 장바구니 아이템
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  options?: string[]; // 예: 샷 추가, 얼음 적게 등
}

// 주문 상태
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

// 주문
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

// 사용자 정보
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

// 카테고리 정보 (UI용)
export interface CategoryInfo {
  id: MenuCategory;
  name: string;
  icon: string;
}

// 카테고리 목록
export const CATEGORIES: CategoryInfo[] = [
  { id: 'coffee', name: '커피', icon: '☕' },
  { id: 'beverage', name: '음료', icon: '🥤' },
  { id: 'dessert', name: '디저트', icon: '🍰' },
  { id: 'bakery', name: '베이커리', icon: '🥐' },
];
