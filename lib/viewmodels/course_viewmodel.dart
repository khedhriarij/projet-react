import 'package:flutter/material.dart';
import '../models/course_model.dart';
import '../repositories/course_repository.dart';

class CourseViewModel with ChangeNotifier {
  final CourseRepository _repository = CourseRepository();
  
  List<CourseModel> _allCourses = [];
  List<CourseModel> _filteredCourses = [];
  bool _isLoading = false;
  String _selectedCategory = 'Tous';

  List<CourseModel> get filteredCourses => _filteredCourses;
  bool get isLoading => _isLoading;
  String get selectedCategory => _selectedCategory;

  // Charger les cours au démarrage
  Future<void> loadCourses() async {
    _isLoading = true;
    notifyListeners();

    try {
      _allCourses = await _repository.fetchCourses();
      _filteredCourses = _allCourses;
    } catch (e) {
      debugPrint("Erreur chargement cours: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Filtrer par catégorie
  void setCategory(String category) {
    _selectedCategory = category;
    if (category == 'Tous') {
      _filteredCourses = _allCourses;
    } else {
      _filteredCourses = _allCourses.where((c) => c.category == category).toList();
    }
    notifyListeners();
  }

  // Rechercher un cours
  void search(String query) {
    if (query.isEmpty) {
      // Remettre le filtre catégorie actuel
      setCategory(_selectedCategory);
    } else {
      _filteredCourses = _allCourses.where((c) => 
        c.title.toLowerCase().contains(query.toLowerCase()) ||
        c.category.toLowerCase().contains(query.toLowerCase())
      ).toList();
      notifyListeners();
    }
  }
}
