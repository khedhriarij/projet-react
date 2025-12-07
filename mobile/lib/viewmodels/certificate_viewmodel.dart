import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/certificate_model.dart';

class CertificateViewModel extends ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  List<CertificateModel> _myCertificates = [];
  List<CertificateModel> get myCertificates => _myCertificates;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  // Récupérer les certificats de l'utilisateur connecté
  Future<void> fetchMyCertificates() async {
    final user = _auth.currentUser;
    if (user == null) return;

    _isLoading = true;
    notifyListeners();

    try {
      final snapshot = await _firestore
          .collection('certificates')
          .where('studentId', isEqualTo: user.uid)
          .orderBy('issueDate', descending: true)
          .get();

      _myCertificates = snapshot.docs.map((doc) {
        // Conversion manuelle pour être sûr des types
        final data = doc.data();
        return CertificateModel(
          id: doc.id,
          studentId: data['studentId'] ?? '',
          studentName: data['studentName'] ?? '',
          courseId: data['courseId'] ?? '',
          courseTitle: data['courseTitle'] ?? '',
          issueDate: (data['issueDate'] is Timestamp) 
              ? (data['issueDate'] as Timestamp).toDate() 
              : DateTime.parse(data['issueDate'].toString()),
          certificateUrl: data['certificateUrl'] ?? '',
        );
      }).toList();
    } catch (e) {
      print("Erreur récupération certificats: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
