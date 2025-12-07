import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/quiz_model.dart';

class QuizViewModel extends ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  List<QuestionModel> _currentQuestions = [];
  List<QuestionModel> get currentQuestions => _currentQuestions;

  // Charger un quiz pour un cours donné
  Future<void> loadQuizForCourse(String courseId) async {
    _isLoading = true;
    notifyListeners();

    try {
      // On suppose qu'il y a une sous-collection 'quizzes' dans le cours
      final snapshot = await _firestore
          .collection('courses')
          .doc(courseId)
          .collection('quizzes')
          .limit(1) // On prend le premier quiz trouvé pour l'instant
          .get();

      if (snapshot.docs.isNotEmpty) {
        final quizData = snapshot.docs.first.data();
        final quiz = QuizModel.fromMap(quizData, snapshot.docs.first.id);
        _currentQuestions = quiz.questions;
      } else {
        _currentQuestions = [];
      }
    } catch (e) {
      print("Erreur chargement quiz: $e");
      _currentQuestions = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Calculer le score
  double calculateScore(Map<int, int> userAnswers) {
    if (_currentQuestions.isEmpty) return 0.0;

    int correctCount = 0;
    userAnswers.forEach((questionIndex, answerIndex) {
      if (questionIndex < _currentQuestions.length) {
        if (_currentQuestions[questionIndex].correctOptionIndex == answerIndex) {
          correctCount++;
        }
      }
    });

    return (correctCount / _currentQuestions.length) * 100;
  }
}
