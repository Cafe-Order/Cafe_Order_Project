import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'cart_screen.dart';

class OrderScreen extends StatefulWidget {
  const OrderScreen({super.key});

  @override
  State<OrderScreen> createState() => _OrderScreenState();
}

class _OrderScreenState extends State<OrderScreen>
    with SingleTickerProviderStateMixin {
  List<Map<String, dynamic>> cart = [];
  late TabController _tabController;
  StreamSubscription<DocumentSnapshot>? _cartSubscription;

  final List<String> categories = ['전체', 'coffee', 'beverage', 'bakery'];
  final Map<String, String> categoryNames = {
    '전체': '전체',
    'coffee': '커피',
    'beverage': '음료',
    'bakery': '베이커리',
  };

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: categories.length, vsync: this);
    _subscribeToCart();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _cartSubscription?.cancel();
    super.dispose();
  }

  // 장바구니 실시간 구독 (웹 구조에 맞게)
  void _subscribeToCart() {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;

    _cartSubscription = FirebaseFirestore.instance
        .collection('carts')
        .doc(user.uid)
        .snapshots()
        .listen((doc) {
          if (!mounted) return;

          if (doc.exists && doc.data() != null) {
            final data = doc.data()!;
            final items = data['items'] as List<dynamic>? ?? [];
            setState(() {
              cart = items.map((item) {
                // 웹 구조: menuItem 안에 데이터, quantity는 밖에
                final menuItem =
                    item['menuItem'] as Map<String, dynamic>? ?? item;
                final quantity = item['quantity'] ?? menuItem['quantity'] ?? 1;
                return {
                  'name': menuItem['name'] ?? '알 수 없음',
                  'price': menuItem['price'] ?? 0,
                  'quantity': quantity,
                  'category': menuItem['category'] ?? '',
                  'description': menuItem['description'] ?? '',
                  'id': menuItem['id'] ?? '',
                  'imageUrl': menuItem['imageUrl'] ?? '',
                };
              }).toList();
            });
          } else {
            setState(() {
              cart = [];
            });
          }
        });
  }

  // 장바구니 저장 (웹 구조에 맞게 menuItem 사용)
  Future<void> _addItemToCart(Map<String, dynamic> newItem) async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('로그인이 필요합니다')));
      return;
    }

    final name = newItem['name'] ?? '알 수 없음';
    final price = newItem['price'] ?? 0;
    final category = newItem['category'] ?? '';
    final description = newItem['description'] ?? '';
    final id = newItem['id'] ?? '';
    final imageUrl = newItem['imageUrl'] ?? '';

    try {
      // 현재 장바구니에서 같은 아이템 찾기
      final existingIndex = cart.indexWhere((i) => i['name'] == name);

      List<Map<String, dynamic>> updatedCart = List.from(cart);

      if (existingIndex >= 0) {
        // 이미 있으면 수량만 증가
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          'quantity': (updatedCart[existingIndex]['quantity'] ?? 1) + 1,
        };
      } else {
        // 없으면 새로 추가
        updatedCart.add({
          'name': name,
          'price': price,
          'quantity': 1,
          'category': category,
          'description': description,
          'id': id,
          'imageUrl': imageUrl,
        });
      }

      // Firebase에 저장 (웹 구조: quantity는 menuItem 밖에)
      await FirebaseFirestore.instance.collection('carts').doc(user.uid).set({
        'items': updatedCart.map((item) {
          return {
            'menuItem': {
              'name': item['name'],
              'price': item['price'],
              'category': item['category'] ?? '',
              'description': item['description'] ?? '',
              'id': item['id'] ?? '',
              'imageUrl': item['imageUrl'] ?? '',
              'isAvailable': true,
            },
            'quantity': item['quantity'],
          };
        }).toList(),
        'updatedAt': FieldValue.serverTimestamp(),
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle, color: Colors.white),
                const SizedBox(width: 8),
                Text('$name 담김!'),
              ],
            ),
            backgroundColor: const Color(0xFF00704A),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            duration: const Duration(seconds: 1),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('저장 실패: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  IconData _getCategoryIcon(String? category) {
    switch (category) {
      case 'coffee':
        return Icons.coffee;
      case 'beverage':
        return Icons.local_drink;
      case 'bakery':
        return Icons.bakery_dining;
      default:
        return Icons.restaurant;
    }
  }

  Widget _buildMenuGrid(String category) {
    Query<Map<String, dynamic>> query = FirebaseFirestore.instance
        .collection('menus')
        .where('isAvailable', isEqualTo: true);

    if (category != '전체') {
      query = query.where('category', isEqualTo: category);
    }

    return StreamBuilder<QuerySnapshot>(
      stream: query.snapshots(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: CircularProgressIndicator(color: Color(0xFF00704A)),
          );
        }

        if (snapshot.hasError) {
          return Center(child: Text('에러: ${snapshot.error}'));
        }

        if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
          return const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.coffee_outlined, size: 60, color: Colors.grey),
                SizedBox(height: 16),
                Text(
                  '메뉴가 없습니다',
                  style: TextStyle(color: Colors.grey, fontSize: 16),
                ),
              ],
            ),
          );
        }

        final menuItems = snapshot.data!.docs;

        return GridView.builder(
          padding: const EdgeInsets.all(16),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 0.72,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
          ),
          itemCount: menuItems.length,
          itemBuilder: (context, index) {
            final doc = menuItems[index];
            final item = doc.data() as Map<String, dynamic>;
            item['id'] = doc.id; // 문서 ID 추가
            return _buildMenuItem(item);
          },
        );
      },
    );
  }

  Widget _buildMenuItem(Map<String, dynamic> item) {
    String imageUrl = item['imageUrl'] as String? ?? '';

    // GitHub blob URL을 raw URL로 변환
    if (imageUrl.contains('github.com') && imageUrl.contains('/blob/')) {
      imageUrl = imageUrl
          .replaceFirst('github.com', 'raw.githubusercontent.com')
          .replaceFirst('/blob/', '/')
          .replaceAll('?raw=true', '');
    }

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: InkWell(
        onTap: () => _addItemToCart({
          'name': item['name'],
          'price': item['price'],
          'category': item['category'],
          'description': item['description'] ?? '',
          'id': item['id'] ?? '',
          'imageUrl': imageUrl,
        }),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // 이미지 또는 아이콘
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: const Color(0xFF00704A).withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                clipBehavior: Clip.antiAlias,
                child: imageUrl.isNotEmpty
                    ? Image.network(
                        imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Icon(
                            _getCategoryIcon(item['category']),
                            size: 45,
                            color: const Color(0xFF00704A),
                          );
                        },
                        loadingBuilder: (context, child, loadingProgress) {
                          if (loadingProgress == null) return child;
                          return const Center(
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Color(0xFF00704A),
                            ),
                          );
                        },
                      )
                    : Icon(
                        _getCategoryIcon(item['category']),
                        size: 45,
                        color: const Color(0xFF00704A),
                      ),
              ),
              const SizedBox(height: 12),
              Text(
                item['name'] ?? '',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Colors.black87,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              Text(
                '${item['price']}원',
                style: TextStyle(fontSize: 13, color: Colors.grey[600]),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF00704A),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  '담기',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          'Order',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
        centerTitle: true,
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.shopping_bag_outlined, size: 28),
                onPressed: () async {
                  await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => CartScreen(cartItems: cart),
                    ),
                  );
                },
              ),
              if (cart.isNotEmpty)
                Positioned(
                  right: 6,
                  top: 6,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Color(0xFF00704A),
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 18,
                      minHeight: 18,
                    ),
                    child: Text(
                      '${cart.length}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 8),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(50),
          child: Container(
            decoration: BoxDecoration(
              border: Border(bottom: BorderSide(color: Colors.grey.shade200)),
            ),
            child: TabBar(
              controller: _tabController,
              labelColor: const Color(0xFF00704A),
              unselectedLabelColor: Colors.grey,
              indicatorColor: const Color(0xFF00704A),
              indicatorWeight: 3,
              labelStyle: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 15,
              ),
              tabs: categories.map((c) => Tab(text: categoryNames[c])).toList(),
            ),
          ),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: categories.map((c) => _buildMenuGrid(c)).toList(),
      ),
      floatingActionButton: cart.isNotEmpty
          ? FloatingActionButton.extended(
              onPressed: () async {
                await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => CartScreen(cartItems: cart),
                  ),
                );
              },
              backgroundColor: const Color(0xFF00704A),
              foregroundColor: Colors.white, // 👈 이 줄 추가!
              icon: const Icon(Icons.shopping_cart),
              label: Text(
                '장바구니 (${cart.length})',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            )
          : null,
    );
  }
}
