import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { MenuItem, MenuCategory } from '../types';

const MENU_COLLECTION = 'menus';

// Firestore 데이터를 MenuItem으로 변환
const convertToMenuItem = (doc: any): MenuItem => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    imageUrl: data.imageUrl,
    isAvailable: data.isAvailable ?? true,
    createdAt: data.createdAt?.toDate() || new Date(),
  };
};

// 전체 메뉴 가져오기
export const getAllMenus = async (): Promise<MenuItem[]> => {
  try {
    const q = query(collection(db, MENU_COLLECTION), orderBy('category'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertToMenuItem);
  } catch (error) {
    console.error('메뉴 조회 실패:', error);
    throw error;
  }
};

// 카테고리별 메뉴 가져오기
export const getMenusByCategory = async (category: MenuCategory): Promise<MenuItem[]> => {
  try {
    const q = query(
      collection(db, MENU_COLLECTION),
      where('category', '==', category),
      where('isAvailable', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertToMenuItem);
  } catch (error) {
    console.error('카테고리별 메뉴 조회 실패:', error);
    throw error;
  }
};

// 단일 메뉴 가져오기
export const getMenuById = async (id: string): Promise<MenuItem | null> => {
  try {
    const docRef = doc(db, MENU_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return convertToMenuItem(docSnap);
    }
    return null;
  } catch (error) {
    console.error('메뉴 조회 실패:', error);
    throw error;
  }
};

// 메뉴 추가 (관리자용)
export const addMenu = async (menu: Omit<MenuItem, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, MENU_COLLECTION), {
      ...menu,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('메뉴 추가 실패:', error);
    throw error;
  }
};

// 메뉴 수정 (관리자용)
export const updateMenu = async (id: string, menu: Partial<MenuItem>): Promise<void> => {
  try {
    const docRef = doc(db, MENU_COLLECTION, id);
    await updateDoc(docRef, menu);
  } catch (error) {
    console.error('메뉴 수정 실패:', error);
    throw error;
  }
};

// 메뉴 삭제 (관리자용)
export const deleteMenu = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, MENU_COLLECTION, id));
  } catch (error) {
    console.error('메뉴 삭제 실패:', error);
    throw error;
  }
};

// 메뉴 실시간 구독 (웹/앱 동기화용)
export const subscribeToMenus = (callback: (menus: MenuItem[]) => void) => {
  const q = query(collection(db, MENU_COLLECTION), orderBy('category'));
  return onSnapshot(q, (snapshot) => {
    const menus = snapshot.docs.map(convertToMenuItem);
    callback(menus);
  });
};

// 카테고리별 메뉴 실시간 구독
export const subscribeToMenusByCategory = (
  category: MenuCategory,
  callback: (menus: MenuItem[]) => void
) => {
  const q = query(
    collection(db, MENU_COLLECTION),
    where('category', '==', category)
  );
  return onSnapshot(q, (snapshot) => {
    const menus = snapshot.docs.map(convertToMenuItem);
    callback(menus);
  });
};
