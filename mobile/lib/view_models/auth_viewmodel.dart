import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_model.dart';

class AuthViewModel with ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  UserModel? _user;
  bool _loading = false;
  String? _error;

  UserModel? get user => _user;
  bool get loading => _loading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  // Initialisation
  Future<void> initialize() async {
    _loading = true;
    notifyListeners();

    try {
      final currentUser = _auth.currentUser;
      if (currentUser != null) {
        await _loadUserData(currentUser.uid);
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  // Connexion
  Future<bool> login(String email, String password) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final userCredential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      if (userCredential.user != null) {
        await _loadUserData(userCredential.user!.uid);

        // Mettre à jour le statut online
        await _firestore.collection('users').doc(userCredential.user!.uid).update({
          'online': true,
          'lastLogin': FieldValue.serverTimestamp(),
        });

        _loading = false;
        notifyListeners();
        return true;
      }
    } on FirebaseAuthException catch (e) {
      _error = _getAuthErrorMessage(e);
    } catch (e) {
      _error = 'Erreur lors de la connexion: ${e.toString()}';
    }

    _loading = false;
    notifyListeners();
    return false;
  }

  // Inscription
  Future<bool> signup(String email, String password, String displayName) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final userCredential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      if (userCredential.user != null) {
        // Créer le profil utilisateur
        final user = UserModel(
          uid: userCredential.user!.uid,
          email: email,
          displayName: displayName,
          role: 'student',
          online: true,
          createdAt: DateTime.now(),
        );

        await _saveUserData(user);
        _user = user;

        _loading = false;
        notifyListeners();
        return true;
      }
    } on FirebaseAuthException catch (e) {
      _error = _getAuthErrorMessage(e);
    } catch (e) {
      _error = 'Erreur lors de l\'inscription: ${e.toString()}';
    }

    _loading = false;
    notifyListeners();
    return false;
  }

  // Déconnexion
  Future<void> logout() async {
    _loading = true;
    notifyListeners();

    try {
      // Mettre à jour le statut offline
      if (_user != null) {
        await _firestore.collection('users').doc(_user!.uid).update({
          'online': false,
        });
      }

      await _auth.signOut();
      _user = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  // Charger les données utilisateur
  Future<void> _loadUserData(String uid) async {
    try {
      final doc = await _firestore.collection('users').doc(uid).get();
      if (doc.exists) {
        _user = UserModel.fromFirestore(doc.data()!);
      } else {
        // Créer un profil par défaut si non existant
        final currentUser = _auth.currentUser!;
        final user = UserModel(
          uid: uid,
          email: currentUser.email ?? '',
          displayName: currentUser.displayName ?? 'Utilisateur',
          role: 'student',
          online: true,
          createdAt: DateTime.now(),
        );
        await _saveUserData(user);
        _user = user;
      }
    } catch (e) {
      _error = 'Erreur lors du chargement du profil: ${e.toString()}';
    }
  }

  // Sauvegarder les données utilisateur
  Future<void> _saveUserData(UserModel user) async {
    await _firestore.collection('users').doc(user.uid).set(user.toFirestore());

    // Créer également le profil détaillé
    await _firestore.collection('userProfiles').doc(user.uid).set({
      'displayName': user.displayName,
      'email': user.email,
      'role': user.role,
      'createdAt': FieldValue.serverTimestamp(),
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  // Messages d'erreur Firebase
  String _getAuthErrorMessage(FirebaseAuthException e) {
    switch (e.code) {
      case 'invalid-credential':
      case 'user-not-found':
        return 'Aucun compte trouvé avec cet email';
      case 'wrong-password':
        return 'Mot de passe incorrect';
      case 'invalid-email':
        return 'Format d\'email invalide';
      case 'user-disabled':
        return 'Ce compte a été désactivé';
      case 'too-many-requests':
        return 'Trop de tentatives. Réessayez plus tard';
      case 'email-already-in-use':
        return 'Un compte existe déjà avec cet email';
      case 'weak-password':
        return 'Le mot de passe est trop faible';
      default:
        return e.message ?? 'Erreur d\'authentification';
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}