import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_model.dart';

class AuthRepository {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // --- Inscription ---
  Future<UserModel> signUp(
      {required String email,
      required String password,
      required String name}) async {
    try {
      UserCredential result = await _auth.createUserWithEmailAndPassword(
          email: email, password: password);
      User? user = result.user;

      if (user == null) throw Exception("Erreur création auth.");

      // Création du profil Firestore
      UserModel newUser = UserModel(
        uid: user.uid,
        email: email,
        displayName: name,
        role: 'student',
        createdAt: DateTime.now(),
      );

      await _firestore
          .collection('users')
          .doc(user.uid)
          .set(newUser.toFirestore());
      return newUser;
    } on FirebaseAuthException catch (e) {
      throw Exception(_translateError(e.code));
    }
  }

  // --- Connexion CORRIGÉE ---
  Future<UserModel> signIn(
      {required String email, required String password}) async {
    try {
      // 1. Authentification
      UserCredential result = await _auth.signInWithEmailAndPassword(
          email: email, password: password);
      User? user = result.user;

      if (user == null) throw Exception("Utilisateur non trouvé.");

      // 2. Récupération du profil Firestore
      DocumentSnapshot doc =
          await _firestore.collection('users').doc(user.uid).get();

      if (doc.exists) {
        // Tout va bien, on retourne l'utilisateur
        return UserModel.fromFirestore(
            doc.data() as Map<String, dynamic>, user.uid);
      } else {
        // CAS CRITIQUE : L'user est connecté mais n'a pas de profil Firestore
        // On le crée à la volée pour ne pas bloquer l'utilisateur
        print("⚠️ Profil manquant pour ${user.email}. Création automatique...");

        UserModel recoveredUser = UserModel(
          uid: user.uid,
          email: user.email ?? email,
          displayName: user.displayName ??
              'Utilisateur', // On essaie de récupérer le nom d'Auth
          role: 'student',
          createdAt: DateTime.now(),
        );

        await _firestore
            .collection('users')
            .doc(user.uid)
            .set(recoveredUser.toFirestore());
        return recoveredUser;
      }
    } on FirebaseAuthException catch (e) {
      throw Exception(_translateError(e.code));
    }
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }

  String _translateError(String code) {
    switch (code) {
      case 'user-not-found':
        return 'Email inconnu.';
      case 'wrong-password':
        return 'Mot de passe incorrect.';
      case 'email-already-in-use':
        return 'Cet email est déjà utilisé.';
      case 'invalid-email':
        return 'Format email invalide.';
      default:
        return 'Erreur: $code';
    }
  }
}
