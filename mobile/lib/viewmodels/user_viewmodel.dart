import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../repositories/user_repository.dart';
import 'package:firebase_auth/firebase_auth.dart';

class UserViewModel with ChangeNotifier {
  final UserRepository _userRepository = UserRepository();
  
  UserModel? _currentUser;
  bool _isLoading = false;

  UserModel? get currentUser => _currentUser;
  bool get isLoading => _isLoading;

  // Charger l'utilisateur courant (celui connecté)
  Future<void> loadCurrentUser() async {
    final firebaseUser = FirebaseAuth.instance.currentUser;
    if (firebaseUser == null) return;

    _isLoading = true;
    notifyListeners();

    try {
      _currentUser = await _userRepository.getUser(firebaseUser.uid);
    } catch (e) {
      debugPrint("Erreur chargement user: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
