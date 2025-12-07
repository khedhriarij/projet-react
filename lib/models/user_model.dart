import 'package:cloud_firestore/cloud_firestore.dart';

class UserModel {
  final String uid;
  final String email;
  final String displayName;
  final String role; // 'student', 'instructor', 'admin'
  final DateTime createdAt;
  final String? photoURL;

  UserModel({
    required this.uid,
    required this.email,
    required this.displayName,
    required this.role,
    required this.createdAt,
    this.photoURL,
  });

  // Convertir depuis Firestore vers l'objet Dart
  factory UserModel.fromFirestore(Map<String, dynamic> data, String uid) {
    return UserModel(
      uid: uid,
      email: data['email'] ?? '',
      displayName: data['displayName'] ?? 'Utilisateur',
      role: data['role'] ?? 'student',
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      photoURL: data['photoURL'],
    );
  }

  // Convertir vers Firestore pour la sauvegarde
  Map<String, dynamic> toFirestore() {
    return {
      'uid': uid,
      'email': email,
      'displayName': displayName,
      'role': role,
      'createdAt': createdAt,
      'photoURL': photoURL,
    };
  }
}
