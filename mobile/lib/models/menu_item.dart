class MenuItem {
  final String id;
  final String name;
  final String description;
  final int price;
  final String imageUrl;
  final String category;
  final bool isAvailable;

  MenuItem({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
    required this.category,
    this.isAvailable = true,
  });

  // Firestore에서 데이터 가져올 때 사용
  factory MenuItem.fromMap(Map<String, dynamic> map, String id) {
    return MenuItem(
      id: id,
      name: map['name'] ?? '',
      description: map['description'] ?? '',
      price: map['price'] ?? 0,
      imageUrl: map['imageUrl'] ?? '',
      category: map['category'] ?? '',
      isAvailable: map['isAvailable'] ?? true,
    );
  }

  // Firestore에 데이터 저장할 때 사용
  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'description': description,
      'price': price,
      'imageUrl': imageUrl,
      'category': category,
      'isAvailable': isAvailable,
    };
  }
}
