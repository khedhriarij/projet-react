import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/course_model.dart';

class CourseViewModel with ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  List<CourseModel> _courses = [];
  List<CourseModel> _purchasedCourses = [];
  CourseModel? _selectedCourse;
  bool _loading = false;
  String? _error;
  String _searchTerm = '';
  String _selectedCategory = 'Tous';
  String _sortBy = 'popular';

  List<CourseModel> get courses => _courses;
  List<CourseModel> get purchasedCourses => _purchasedCourses;
  CourseModel? get selectedCourse => _selectedCourse;
  bool get loading => _loading;
  String? get error => _error;
  String get searchTerm => _searchTerm;
  String get selectedCategory => _selectedCategory;
  String get sortBy => _sortBy;

  // Charger les cours
  Future<void> loadCourses() async {
    _loading = true;
    notifyListeners();

    try {
      // Essayer Firebase d'abord
      final querySnapshot = await _firestore.collection('courses').get();
      if (querySnapshot.docs.isNotEmpty) {
        _courses = querySnapshot.docs.map((doc) {
          return CourseModel.fromJson({'id': doc.id, ...doc.data()});
        }).toList();
      } else {
        // Fallback vers les données par défaut
        _courses = _getDefaultCourses();
        await _saveCoursesToLocal();
      }
    } catch (e) {
      // Charger depuis le stockage local en cas d'erreur
      await _loadCoursesFromLocal();
      _error = 'Connexion Firebase échouée, données locales chargées';
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  // Charger les cours achetés
  Future<void> loadPurchasedCourses(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    final purchasedJson = prefs.getString('purchasedCourses_$userId');

    if (purchasedJson != null) {
      final List<dynamic> purchasedList = json.decode(purchasedJson);
      _purchasedCourses = _courses.where((course) {
        return purchasedList.any((purchase) => purchase['courseId'] == course.id);
      }).toList();
    }

    notifyListeners();
  }

  // Acheter un cours
  Future<bool> purchaseCourse(String courseId, String userId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final purchasedJson = prefs.getString('purchasedCourses_$userId');
      final List<dynamic> purchasedList = purchasedJson != null
          ? json.decode(purchasedJson)
          : [];

      // Vérifier si déjà acheté
      if (purchasedList.any((purchase) => purchase['courseId'] == courseId)) {
        _error = 'Vous avez déjà acheté ce cours';
        notifyListeners();
        return false;
      }

      // Ajouter le cours acheté
      purchasedList.add({
        'courseId': courseId,
        'purchasedAt': DateTime.now().toIso8601String(),
        'progress': 0,
      });

      await prefs.setString(
          'purchasedCourses_$userId',
          json.encode(purchasedList)
      );

      await loadPurchasedCourses(userId);
      return true;
    } catch (e) {
      _error = 'Erreur lors de l\'achat: ${e.toString()}';
      notifyListeners();
      return false;
    }
  }

  // Sélectionner un cours
  void selectCourse(CourseModel course) {
    _selectedCourse = course;
    notifyListeners();
  }

  // Filtres et recherche
  void setSearchTerm(String term) {
    _searchTerm = term;
    notifyListeners();
  }

  void setSelectedCategory(String category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void setSortBy(String sort) {
    _sortBy = sort;
    notifyListeners();
  }

  // Cours filtrés
  List<CourseModel> get filteredCourses {
    List<CourseModel> filtered = List.from(_courses);

    // Filtre par recherche
    if (_searchTerm.isNotEmpty) {
      filtered = filtered.where((course) =>
      course.title.toLowerCase().contains(_searchTerm.toLowerCase()) ||
          course.description.toLowerCase().contains(_searchTerm.toLowerCase())
      ).toList();
    }

    // Filtre par catégorie
    if (_selectedCategory != 'Tous') {
      filtered = filtered.where((course) =>
      course.category == _selectedCategory
      ).toList();
    }

    // Tri
    switch (_sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price.compareTo(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price.compareTo(a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating.compareTo(a.rating));
        break;
      case 'students':
        filtered.sort((a, b) => b.students.compareTo(a.students));
        break;
      default:
      // Popular par défaut (featured first)
        filtered.sort((a, b) {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.students.compareTo(a.students);
        });
    }

    return filtered;
  }

  // Données par défaut
  List<CourseModel> _getDefaultCourses() {
    return [
      CourseModel(
        id: '1',
        title: "React Avancé - Les Hooks et Context API",
        description: "Maîtrisez React avec les Hooks modernes, Context API et Redux. Développez des applications complexes avec les meilleures pratiques.",
        price: 89,
        originalPrice: 129,
        category: "Développement",
        image: "https://example.com/react.jpg",
        instructor: "Ahmed Ben Ali",
        rating: 4.8,
        students: 1240,
        duration: "12h 30min",
        level: "Intermédiaire",
        featured: true,
        discountPercentage: 31,
        hasPromotion: true,
      ),
      CourseModel(
        id: '2',
        title: "UI/UX Design avec Figma",
        description: "Apprenez à créer des interfaces utilisateur modernes et intuitives. Prototypage avancé et design system.",
        price: 69,
        originalPrice: 99,
        category: "Design",
        image: "https://example.com/figma.webp",
        instructor: "Sarah Trabelsi",
        rating: 4.9,
        students: 890,
        duration: "8h 15min",
        level: "Débutant",
        featured: false,
        discountPercentage: 30,
        hasPromotion: true,
      ),
    ];
  }

  // Sauvegarde locale
  Future<void> _saveCoursesToLocal() async {
    final prefs = await SharedPreferences.getInstance();
    final coursesJson = json.encode(_courses.map((course) => course.toJson()).toList());
    await prefs.setString('local_courses', coursesJson);
  }

  // Chargement local
  Future<void> _loadCoursesFromLocal() async {
    final prefs = await SharedPreferences.getInstance();
    final coursesJson = prefs.getString('local_courses');

    if (coursesJson != null) {
      final List<dynamic> coursesList = json.decode(coursesJson);
      _courses = coursesList.map((courseJson) => CourseModel.fromJson(courseJson)).toList();
    } else {
      _courses = _getDefaultCourses();
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}