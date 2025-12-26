import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class HomeScreen extends StatefulWidget {
  final VoidCallback? onNavigateToOrder;

  HomeScreen({super.key, this.onNavigateToOrder});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final PageController _bannerController = PageController();
  int _currentBanner = 0;

  // 장바구니에 추가
  Future<void> _addItemToCart(Map<String, dynamic> item) async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('로그인이 필요합니다')));
      return;
    }

    try {
      final cartDoc = await FirebaseFirestore.instance
          .collection('carts')
          .doc(user.uid)
          .get();

      List<Map<String, dynamic>> currentItems = [];
      if (cartDoc.exists && cartDoc.data() != null) {
        final items = cartDoc.data()!['items'] as List<dynamic>? ?? [];
        currentItems = items.map((i) {
          final menuItem = i['menuItem'] as Map<String, dynamic>? ?? i;
          final quantity = i['quantity'] ?? menuItem['quantity'] ?? 1;
          return {
            'name': menuItem['name'],
            'price': menuItem['price'],
            'quantity': quantity,
            'category': menuItem['category'] ?? '',
            'description': menuItem['description'] ?? '',
            'id': menuItem['id'] ?? '',
            'imageUrl': menuItem['imageUrl'] ?? '',
          };
        }).toList();
      }

      final existingIndex = currentItems.indexWhere(
        (i) => i['name'] == item['name'],
      );

      if (existingIndex >= 0) {
        currentItems[existingIndex]['quantity'] =
            (currentItems[existingIndex]['quantity'] ?? 1) + 1;
      } else {
        currentItems.add({
          'name': item['name'],
          'price': item['price'],
          'quantity': 1,
          'category': item['category'] ?? '',
          'description': item['description'] ?? '',
          'id': item['id'] ?? '',
          'imageUrl': item['imageUrl'] ?? '',
        });
      }

      await FirebaseFirestore.instance.collection('carts').doc(user.uid).set({
        'items': currentItems
            .map(
              (i) => {
                'menuItem': {
                  'name': i['name'],
                  'price': i['price'],
                  'category': i['category'] ?? '',
                  'description': i['description'] ?? '',
                  'id': i['id'] ?? '',
                  'imageUrl': i['imageUrl'] ?? '',
                  'isAvailable': true,
                },
                'quantity': i['quantity'],
              },
            )
            .toList(),
        'updatedAt': FieldValue.serverTimestamp(),
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle, color: Colors.white),
                const SizedBox(width: 8),
                Text('${item['name']} 담김!'),
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

  final List<Map<String, dynamic>> banners = [
    {
      'title': '2024 WINTER\ne-FREQUENCY',
      'subtitle': '[행사 기간] 12/01(월) ~ 12/31(수)',
      'gradient': [const Color(0xFF1B5E20), const Color(0xFF4CAF50)],
      'image': Icons.ac_unit,
    },
    {
      'title': '크리스마스 시즌\n스페셜 음료',
      'subtitle': '달콤한 연말의 시작',
      'gradient': [const Color(0xFFC62828), const Color(0xFFE57373)],
      'image': Icons.card_giftcard,
    },
    {
      'title': '신규 회원\n첫 주문 할인',
      'subtitle': '아메리카노 50% 할인',
      'gradient': [const Color(0xFF6F4E37), const Color(0xFFa1887f)],
      'image': Icons.local_offer,
    },
  ];

  @override
  void initState() {
    super.initState();
    // 자동 배너 슬라이드
    Future.delayed(const Duration(seconds: 3), _autoSlide);
  }

  void _autoSlide() {
    if (!mounted) return;
    final nextPage = (_currentBanner + 1) % banners.length;
    _bannerController.animateToPage(
      nextPage,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
    Future.delayed(const Duration(seconds: 3), _autoSlide);
  }

  @override
  void dispose() {
    _bannerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // 상단 헤더
            SliverToBoxAdapter(child: _buildHeader(user)),
            // 배너 슬라이더
            SliverToBoxAdapter(child: _buildBannerSlider()),
            // 추천 메뉴 섹션
            SliverToBoxAdapter(child: _buildRecommendSection()),
            // 이벤트 카드
            SliverToBoxAdapter(child: _buildEventCard()),
            // 스탬프 이벤트 카드
            SliverToBoxAdapter(child: _buildStampEventCard()),
            // 하단 여백
            const SliverToBoxAdapter(child: SizedBox(height: 20)),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(User? user) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF1B3D2F), Color(0xFF2D5A45)],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '☕ ${user?.displayName ?? user?.email?.split('@')[0] ?? '손님'}님,',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      '오늘도 맛있는 커피 한 잔 어떠세요?',
                      style: TextStyle(color: Colors.white70, fontSize: 14),
                    ),
                  ],
                ),
              ),
              // 구글 계정 프로필 이미지
              Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
                ),
                child: CircleAvatar(
                  radius: 22,
                  backgroundColor: Colors.white24,
                  backgroundImage: user?.photoURL != null
                      ? NetworkImage(user!.photoURL!)
                      : null,
                  child: user?.photoURL == null
                      ? const Icon(Icons.person, color: Colors.white, size: 24)
                      : null,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBannerSlider() {
    return Container(
      margin: const EdgeInsets.all(16),
      height: 180,
      child: Stack(
        children: [
          PageView.builder(
            controller: _bannerController,
            onPageChanged: (index) {
              setState(() => _currentBanner = index);
            },
            itemCount: banners.length,
            itemBuilder: (context, index) {
              final banner = banners[index];
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: banner['gradient'] as List<Color>,
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Stack(
                  children: [
                    Positioned(
                      right: 20,
                      bottom: 20,
                      child: Icon(
                        banner['image'] as IconData,
                        size: 80,
                        color: Colors.white.withOpacity(0.3),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            banner['title'] as String,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              height: 1.3,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            banner['subtitle'] as String,
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.9),
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
          // 인디케이터
          Positioned(
            bottom: 12,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                banners.length,
                (index) => Container(
                  width: _currentBanner == index ? 20 : 8,
                  height: 8,
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  decoration: BoxDecoration(
                    color: _currentBanner == index
                        ? Colors.white
                        : Colors.white.withOpacity(0.5),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecommendSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                '추천 메뉴',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              GestureDetector(
                onTap: widget.onNavigateToOrder,
                child: const Text(
                  '더보기 >',
                  style: TextStyle(
                    fontSize: 14,
                    color: Color(0xFF00704A),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 200,
          child: StreamBuilder<QuerySnapshot>(
            stream: FirebaseFirestore.instance
                .collection('menus')
                .where('isAvailable', isEqualTo: true)
                .limit(5)
                .snapshots(),
            builder: (context, snapshot) {
              if (!snapshot.hasData) {
                return const Center(child: CircularProgressIndicator());
              }

              final menus = snapshot.data!.docs;

              if (menus.isEmpty) {
                return const Center(child: Text('메뉴가 없습니다'));
              }

              return ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: menus.length,
                itemBuilder: (context, index) {
                  final menu = menus[index].data() as Map<String, dynamic>;
                  return _recommendMenuItem(menu);
                },
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _recommendMenuItem(Map<String, dynamic> menu) {
    IconData icon;
    switch (menu['category']) {
      case 'coffee':
        icon = Icons.coffee;
        break;
      case 'beverage':
        icon = Icons.local_drink;
        break;
      case 'bakery':
        icon = Icons.bakery_dining;
        break;
      default:
        icon = Icons.restaurant;
    }

    // 이미지 URL 가져오기
    String imageUrl = menu['imageUrl'] as String? ?? '';

    // GitHub blob URL을 raw URL로 변환
    if (imageUrl.contains('github.com') && imageUrl.contains('/blob/')) {
      imageUrl = imageUrl
          .replaceFirst('github.com', 'raw.githubusercontent.com')
          .replaceFirst('/blob/', '/')
          .replaceAll('?raw=true', '');
    }

    return Container(
      width: 140,
      margin: const EdgeInsets.only(right: 12),
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: InkWell(
          onTap: () => _addItemToCart(menu),
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 60,
                  height: 60,
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
                              icon,
                              size: 32,
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
                      : Icon(icon, size: 32, color: const Color(0xFF00704A)),
                ),
                const SizedBox(height: 8),
                Text(
                  menu['name'] ?? '',
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  '${menu['price']}원',
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF00704A),
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 5,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFF00704A),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    '담기',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildEventCard() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE53935),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: const Text(
                    'EVENT',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  '첫 주문 고객 대상\n아메리카노 1+1 쿠폰\n받으세요!',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '2024. 12. 1 (일) ~ 12. 31 (화)',
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: const Color(0xFFFFF3E0),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.local_cafe,
              size: 40,
              color: Color(0xFF6F4E37),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStampEventCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFF00704A),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: const Text(
                    'STAMP',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  '스탬프 10개 적립 시\n음료 1잔 무료!',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: List.generate(10, (index) {
                    return Padding(
                      padding: const EdgeInsets.only(right: 4),
                      child: Icon(
                        index < 3 ? Icons.coffee : Icons.coffee_outlined,
                        size: 18,
                        color: index < 3
                            ? const Color(0xFF00704A)
                            : Colors.grey[300],
                      ),
                    );
                  }),
                ),
              ],
            ),
          ),
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: const Color(0xFFE8F5E9),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '3',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF00704A),
                  ),
                ),
                Text(
                  '/ 10',
                  style: TextStyle(fontSize: 12, color: Color(0xFF00704A)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
