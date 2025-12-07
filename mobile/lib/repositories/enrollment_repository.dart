import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/enrollment_model.dart';

class EnrollmentRepository {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Stream<List<Enrollment>> getUserEnrollments(String userId) {
    return _firestore
        .collection('enrollments')
        .where('userId', isEqualTo: userId)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => Enrollment.fromJson({...doc.data(), 'id': doc.id}))
            .toList());
  }

  Future<void> enrollInCourse(String userId, String courseId) async {
    try {
      final enrollmentId = '${userId}_$courseId';
      
      await _firestore.collection('enrollments').doc(enrollmentId).set({
        'id': enrollmentId,
        'userId': userId,
        'courseId': courseId,
        'progress': 0.0,
        'enrolledAt': FieldValue.serverTimestamp(),
        'lastAccessed': FieldValue.serverTimestamp(),
        'nextLesson': 'Introduction',
        'completed': false,
      });

      // Incrémenter le compteur d'étudiants
      await _firestore.collection('courses').doc(courseId).update({
        'students': FieldValue.increment(1),
      });
    } catch (e) {
      throw Exception('Erreur inscription cours: $e');
    }
  }

  Future<void> updateProgress(String enrollmentId, double progress, String nextLesson) async {
    try {
      final completed = progress >= 100;
      
      await _firestore.collection('enrollments').doc(enrollmentId).update({
        'progress': progress,
        'lastAccessed': FieldValue.serverTimestamp(),
        'nextLesson': nextLesson,
        'completed': completed,
      });
    } catch (e) {
      throw Exception('Erreur mise à jour progression: $e');
    }
  }

  Future<bool> isUserEnrolled(String userId, String courseId) async {
    try {
      final doc = await _firestore
          .collection('enrollments')
          .doc('${userId}_$courseId')
          .get();
      return doc.exists;
    } catch (e) {
      return false;
    }
  }

  Future<int> getEnrolledCoursesCount(String userId) async {
    try {
      final snapshot = await _firestore
          .collection('enrollments')
          .where('userId', isEqualTo: userId)
          .get();
      return snapshot.docs.length;
    } catch (e) {
      return 0;
    }
  }

  Future<int> getCompletedCoursesCount(String userId) async {
    try {
      final snapshot = await _firestore
          .collection('enrollments')
          .where('userId', isEqualTo: userId)
          .where('completed', isEqualTo: true)
          .get();
      return snapshot.docs.length;
    } catch (e) {
      return 0;
    }
  }
}