import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/course_model.dart';
import '../models/quiz_model.dart';

class AdminService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  bool isSuperAdmin(String? email) {
    return email == "eyabayoudh@gmail.com";
  }

  // Ajouter un cours
  Future<void> addCourse(CourseModel course) async {
    DocumentReference docRef = _firestore.collection('courses').doc();
    final courseData = _courseToMap(course);
    await docRef.set(courseData);
  }

  // --- NOUVEAU : Modifier un cours ---
  Future<void> updateCourse(String courseId, CourseModel updatedCourse) async {
    // On ne met pas à jour rating/students/createdAt pour ne pas perdre l'historique
    await _firestore.collection('courses').doc(courseId).update({
      'title': updatedCourse.title,
      'description': updatedCourse.description,
      'price': updatedCourse.price,
      'originalPrice': updatedCourse.originalPrice,
      'category': updatedCourse.category,
      'image': updatedCourse.image,
      'level': updatedCourse.level,
      'duration': updatedCourse.duration,
      'discountPercentage': updatedCourse.discountPercentage,
    });
  }

  // --- NOUVEAU : Supprimer un cours ---
  Future<void> deleteCourse(String courseId) async {
    await _firestore.collection('courses').doc(courseId).delete();
  }

  // Helper pour convertir en Map
  Map<String, dynamic> _courseToMap(CourseModel course) {
    return {
      'title': course.title,
      'description': course.description,
      'price': course.price,
      'originalPrice': course.originalPrice,
      'category': course.category,
      'image': course.image,
      'instructor': course.instructor,
      'level': course.level,
      'duration': course.duration,
      'rating': course.rating,
      'students': course.students,
      'discountPercentage': course.discountPercentage,
      'createdAt': FieldValue.serverTimestamp(),
    };
  }

  // Ajouter un quiz (inchangé)
  Future<void> addQuizToCourse(String courseId, QuizModel quiz) async {
    await _firestore.collection('courses').doc(courseId).collection('quizzes').add(quiz.toMap());
  }
}
