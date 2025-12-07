import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/certificate_model.dart';

class CertificateService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  Future<String?> generateCertificate(String courseId, String courseTitle) async {
    final user = _auth.currentUser;
    if (user == null) return null;

    final newCert = CertificateModel(
      id: "", 
      studentId: user.uid,
      studentName: user.displayName ?? user.email?.split('@')[0] ?? "Étudiant",
      courseId: courseId,
      courseTitle: courseTitle,
      issueDate: DateTime.now(),
      certificateUrl: "https://api.example.com/cert?uid=${user.uid}", // Placeholder
    );

    try {
      // On vérifie si un certificat existe déjà pour éviter les doublons
      final existing = await _firestore.collection('certificates')
          .where('studentId', isEqualTo: user.uid)
          .where('courseId', isEqualTo: courseId)
          .get();

      if (existing.docs.isNotEmpty) {
        return existing.docs.first.id;
      }

      DocumentReference docRef = await _firestore.collection('certificates').add(newCert.toMap());
      return docRef.id;
    } catch (e) {
      print("Erreur: $e");
      return null;
    }
  }
}
