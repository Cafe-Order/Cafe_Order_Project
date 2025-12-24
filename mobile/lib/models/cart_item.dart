import 'menu_item.dart';

class CartItem {
  final String id;
  final MenuItem menuItem;
  final String size; // S, M, L
  final int shotCount; // 추가 샷 수
  final bool isIced; // 아이스 여부
  int quantity;

  CartItem({
    required this.id,
    required this.menuItem,
    this.size = 'M',
    this.shotCount = 0,
    this.isIced = false,
    this.quantity = 1,
  });

  // 옵션에 따른 추가 금액 계산
  int get optionPrice {
    int additional = 0;

    // 사이즈별 추가금
    if (size == 'L') additional += 500;
    if (size == 'S') additional -= 300;

    // 샷 추가 (1샷당 500원)
    additional += shotCount * 500;

    return additional;
  }

  // 총 가격 (기본가 + 옵션 + 수량)
  int get totalPrice {
    return (menuItem.price + optionPrice) * quantity;
  }

  // 옵션 문자열
  String get optionString {
    List<String> options = [];
    options.add(size);
    if (isIced) options.add('ICE');
    if (shotCount > 0) options.add('샷 +$shotCount');
    return options.join(' / ');
  }

  Map<String, dynamic> toMap() {
    return {
      'menuItemId': menuItem.id,
      'menuItemName': menuItem.name,
      'menuItemPrice': menuItem.price,
      'size': size,
      'shotCount': shotCount,
      'isIced': isIced,
      'quantity': quantity,
      'totalPrice': totalPrice,
    };
  }
}
