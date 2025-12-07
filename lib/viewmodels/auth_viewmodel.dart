import 'package:flutter/material.dart';
import '../repositories/auth_repository.dart';
import '../models/user_model.dart';

class AuthViewModel with ChangeNotifier {
  final AuthRepository _authRepository = AuthRepository();
  
  UserModel? _user;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  // --- Inscription ---
  Future<bool> signUp(String email, String password, String name) async {
    _setLoading(true);
    try {
      _user = await _authRepository.signUp(email: email, password: password, name: name);
      _setLoading(false);
      return true; // Succès
    } catch (e) {
      _errorMessage = e.toString().replaceAll("Exception: ", "");
      _setLoading(false);
      return false; // Échec
    }
  }

  // --- Connexion ---
  Future<bool> signIn(String email, String password) async {
    _setLoading(true);
    try {
      _user = await _authRepository.signIn(email: email, password: password);
      _setLoading(false);
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll("Exception: ", "");
      _setLoading(false);
      return false;
    }
  }

  // --- Déconnexion ---
  Future<void> logout() async {
    await _authRepository.signOut();
    _user = null;
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    _errorMessage = null; // Reset error on new action
    notifyListeners();
  }
}
