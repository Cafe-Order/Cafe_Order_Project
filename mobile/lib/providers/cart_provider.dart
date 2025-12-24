import 'package:flutter/foundation.dart';
import '../models/cart_item.dart';
import '../models/menu_item.dart';

class CartProvider with ChangeNotifier {
  final List<CartItem> _items = [];

  List<CartItem> get items => List.unmodifiable(_items);

  int get itemCount => _items.length;

  int get totalPrice {
    return _items.fold(0, (sum, item) => sum + item.totalPrice);
  }

  // 장바구니에 아이템 추가
  void addItem({
    required MenuItem menuItem,
    required String size,
    required int shotCount,
    required bool isIced,
    int quantity = 1,
  }) {
    // 같은 옵션의 아이템이 있는지 확인
    final existingIndex = _items.indexWhere(
      (item) =>
          item.menuItem.id == menuItem.id &&
          item.size == size &&
          item.shotCount == shotCount &&
          item.isIced == isIced,
    );

    if (existingIndex >= 0) {
      // 기존 아이템 수량 증가
      _items[existingIndex].quantity += quantity;
    } else {
      // 새 아이템 추가
      _items.add(
        CartItem(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          menuItem: menuItem,
          size: size,
          shotCount: shotCount,
          isIced: isIced,
          quantity: quantity,
        ),
      );
    }
    notifyListeners();
  }

  // 아이템 수량 증가
  void increaseQuantity(String cartItemId) {
    final index = _items.indexWhere((item) => item.id == cartItemId);
    if (index >= 0) {
      _items[index].quantity++;
      notifyListeners();
    }
  }

  // 아이템 수량 감소
  void decreaseQuantity(String cartItemId) {
    final index = _items.indexWhere((item) => item.id == cartItemId);
    if (index >= 0) {
      if (_items[index].quantity > 1) {
        _items[index].quantity--;
      } else {
        _items.removeAt(index);
      }
      notifyListeners();
    }
  }

  // 아이템 삭제
  void removeItem(String cartItemId) {
    _items.removeWhere((item) => item.id == cartItemId);
    notifyListeners();
  }

  // 장바구니 비우기
  void clearCart() {
    _items.clear();
    notifyListeners();
  }

  // 주문용 데이터로 변환
  List<Map<String, dynamic>> toOrderItems() {
    return _items.map((item) => item.toMap()).toList();
  }
}
