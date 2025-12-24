import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'login_screen.dart';
import 'cart_screen.dart';

class MenuScreen extends StatefulWidget {
  const MenuScreen({super.key});

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  final List<Map<String, dynamic>> menuItems = [
    {'name': '아메리카노', 'price': 4500, 'image': Icons.coffee},
    {'name': '카페라떼', 'price': 5000, 'image': Icons.coffee_maker},
    {'name': '바닐라라떼', 'price': 5500, 'image': Icons.local_cafe},
    {'name': '카푸치노', 'price': 5000, 'image': Icons.emoji_food_beverage},
    {'name': '카라멜마끼아또', 'price': 5500, 'image': Icons.coffee},
    {'name': '초코라떼', 'price': 5500, 'image': Icons.local_drink},
  ];

  final List<Map<String, dynamic>> cart = [];

  void _addToCart(Map<String, dynamic> item) {
    setState(() {
      final existingIndex = cart.indexWhere((i) => i['name'] == item['name']);
      if (existingIndex >= 0) {
        cart[existingIndex]['quantity']++;
      } else {
        cart.add({
          'name': item['name'],
          'price': item['price'],
          'image': item['image'],
          'quantity': 1,
        });
      }
    });
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('${item['name']} 담김!')));
  }

  Future<void> _signOut() async {
    await FirebaseAuth.instance.signOut();
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('메뉴'),
        backgroundColor: const Color(0xFF6F4E37),
        foregroundColor: Colors.white,
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.shopping_cart),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => CartScreen(cartItems: cart),
                    ),
                  );
                },
              ),
              if (cart.isNotEmpty)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 16,
                      minHeight: 16,
                    ),
                    child: Text(
                      '${cart.length}',
                      style: const TextStyle(color: Colors.white, fontSize: 10),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
          IconButton(icon: const Icon(Icons.logout), onPressed: _signOut),
        ],
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: const Color(0xFF6F4E37).withOpacity(0.1),
            child: Row(
              children: [
                const Icon(Icons.person, color: Color(0xFF6F4E37)),
                const SizedBox(width: 8),
                Text(
                  '${user?.email ?? "손님"}님 환영합니다!',
                  style: const TextStyle(fontSize: 16),
                ),
              ],
            ),
          ),
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.75,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
              ),
              itemCount: menuItems.length,
              itemBuilder: (context, index) {
                final item = menuItems[index];
                return Card(
                  elevation: 4,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        item['image'],
                        size: 50,
                        color: const Color(0xFF6F4E37),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        item['name'],
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${item['price']}원',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 8),
                      ElevatedButton(
                        onPressed: () => _addToCart(item),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF6F4E37),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                        ),
                        child: const Text('담기'),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
