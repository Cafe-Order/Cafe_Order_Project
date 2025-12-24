import 'package:cloud_firestore/cloud_firestore.dart';

class OrderModel {
  final String id;
  final String orderedBy;
  final List<Map<String, dynamic>> items;
  final int totalPrice;
  final String status; // pending, preparing, completed, cancelled
  final DateTime createdAt;

  OrderModel({
    required this.id,
    required this.orderedBy,
    required this.items,
    required this.totalPrice,
    required this.status,
    required this.createdAt,
  });

  factory OrderModel.fromMap(Map<String, dynamic> map, String id) {
    return OrderModel(
      id: id,
      orderedBy: map['orderedBy'] ?? '',
      items: List<Map<String, dynamic>>.from(map['items'] ?? []),
      totalPrice: map['totalPrice'] ?? 0,
      status: map['status'] ?? 'pending',
      createdAt: (map['createdAt'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'orderedBy': orderedBy,
      'items': items,
      'totalPrice': totalPrice,
      'status': status,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }

  String get statusText {
    switch (status) {
      case 'pending':
        return '주문 접수';
      case 'preparing':
        return '제조 중';
      case 'completed':
        return '완료';
      case 'cancelled':
        return '취소됨';
      default:
        return status;
    }
  }
}
