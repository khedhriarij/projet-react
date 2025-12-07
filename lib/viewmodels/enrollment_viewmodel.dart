import 'package:flutter/foundation.dart';
import '../models/enrollment_model.dart';
import '../repositories/enrollment_repository.dart';

class EnrollmentViewModel with ChangeNotifier {
  final EnrollmentRepository _enrollmentRepository = EnrollmentRepository();
  
  List<Enrollment> _enrollments = [];
  bool _loading = false;
  String? _errorMessage;

  List<Enrollment> get enrollments => _enrollments;
  bool get loading => _loading;
  String? get errorMessage => _errorMessage;

  int get enrolledCoursesCount => _enrollments.length;
  int get completedCoursesCount => _enrollments.where((e) => e.completed).length;
  double get totalLearningHours {
    return _enrollments.fold(0, (total, enrollment) => total + (enrollment.progress * 10 / 100));
  }
  int get certificatesCount => completedCoursesCount;

  Future<void> loadUserEnrollments(String userId) async {
    _loading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _enrollmentRepository.getUserEnrollments(userId).listen((enrollments) {
        _enrollments = enrollments;
        _loading = false;
        notifyListeners();
      }, onError: (error) {
        _errorMessage = error.toString();
        _loading = false;
        notifyListeners();
      });
    } catch (error) {
      _errorMessage = error.toString();
      _loading = false;
      notifyListeners();
    }
  }

  Future<bool> enrollInCourse(String userId, String courseId) async {
    _loading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _enrollmentRepository.enrollInCourse(userId, courseId);
      _loading = false;
      notifyListeners();
      return true;
    } catch (error) {
      _errorMessage = error.toString();
      _loading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateProgress(String enrollmentId, double progress, String nextLesson) async {
    try {
      await _enrollmentRepository.updateProgress(enrollmentId, progress, nextLesson);
      notifyListeners();
      return true;
    } catch (error) {
      _errorMessage = error.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> isUserEnrolled(String userId, String courseId) async {
    try {
      return await _enrollmentRepository.isUserEnrolled(userId, courseId);
    } catch (e) {
      return false;
    }
  }

  Enrollment? getEnrollmentForCourse(String courseId, String userId) {
    try {
      return _enrollments.firstWhere(
        (enrollment) => enrollment.courseId == courseId && enrollment.userId == userId,
      );
    } catch (e) {
      return null;
    }
  }

  List<Enrollment> get activeEnrollments => _enrollments.where((e) => !e.completed).toList();
  List<Enrollment> get completedEnrollments => _enrollments.where((e) => e.completed).toList();

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}