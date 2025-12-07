import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

class AuthServices {
  static Future<String> signUpwithEmail(String email, String password) async {
    try {
      await FirebaseAuth.instance.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      return 'Sign-Up successful';
    } catch (e) {
      return 'Error during sign-up : ${e.toString()}';
    }
  }

  static handleSignUp(String email, String password, BuildContext context) async {
    String message = await signUpwithEmail(email, password);
    showSnackBar(message, context);
  }

  static Future<String> signInwithEmail(String email, String password) async {
    try {
      await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      return 'Sign-In successful';
    } catch (e) {
      return 'Error during sign-In : ${e.toString()}';
    }
  }

  static handleSignIn(String email, String password, BuildContext context) async {
    String message = await signInwithEmail(email, password);
    showSnackBar(message, context);
  }

  static void showSnackBar(String message, BuildContext context) {
    final snackBar = SnackBar(
      content: Text(message, style: TextStyle(color: Colors.white)),
      backgroundColor: Colors.orange,
      behavior: SnackBarBehavior.floating,
      duration: const Duration(seconds: 3),
    );
    // SnackBar
    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }
}