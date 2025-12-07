import 'package:flutter/material.dart';
// Import du widget Carte de cours
import '../../widgets/course_card.dart';
// Import de la vue détail pour la navigation (si nécessaire via le Grid, bien que CourseCard le gère)
import '../courses/course_detail_view.dart';

class CatalogView extends StatefulWidget {
  const CatalogView({super.key});

  @override
  State<CatalogView> createState() => _CatalogViewState();
}

class _CatalogViewState extends State<CatalogView> {
  // --- ÉTATS POUR LE FILTRAGE ---
  String _searchQuery = "";
  String _selectedCategory = "Tout";

  // Liste des catégories disponibles pour les filtres
  final List<String> _categories = ["Tout", "Design", "Développement", "Business", "Marketing"];

  // --- DONNÉES DES COURS (Source unique statique pour l'exemple) ---
  final List<Map<String, dynamic>> _allCourses = [
    {
      "id": "1",
      "title": "UI/UX Design avec Figma",
      "category": "DESIGN",
      "instructor": "Sarah Trabelsi",
      "rating": 4.9,
      "students": 890,
      "price": 69,
      "oldPrice": 99,
      "image": "https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149052117.jpg",
    },
    {
      "id": "2",
      "title": "Adobe Photoshop Pro",
      "category": "DESIGN",
      "instructor": "Youssef Guedira",
      "rating": 4.6,
      "students": 750,
      "price": 59,
      "oldPrice": 89,
      "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/600px-Adobe_Photoshop_CC_icon.svg.png",
    },
    {
      "id": "3",
      "title": "Marketing Digital 2024",
      "category": "BUSINESS",
      "instructor": "Mohamed Dridi",
      "rating": 4.7,
      "students": 1560,
      "price": 79,
      "oldPrice": 119,
      "image": "https://img.freepik.com/free-photo/marketing-strategy-planning-strategy-concept_53876-42950.jpg",
    },
    {
      "id": "4",
      "title": "React Avancé - Les Hooks",
      "category": "DÉVELOPPEMENT",
      "instructor": "Ahmed Ben Ali",
      "rating": 4.8,
      "students": 1240,
      "price": 89,
      "oldPrice": 129,
      "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    },
    {
      "id": "5",
      "title": "Gestion de Projet Agile",
      "category": "BUSINESS",
      "instructor": "Nadia Boukadida",
      "rating": 4.9,
      "students": 980,
      "price": 85,
      "oldPrice": 125,
      "image": "https://img.freepik.com/free-vector/scrum-method-concept-illustration_114360-1548.jpg",
    },
    {
      "id": "6",
      "title": "Python & Data Science",
      "category": "DÉVELOPPEMENT",
      "instructor": "Leila Mansour",
      "rating": 4.8,
      "students": 2100,
      "price": 99,
      "oldPrice": 149,
      "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/800px-Python-logo-notext.svg.png",
    }
  ];

  // --- LOGIQUE DE FILTRAGE ---
  List<Map<String, dynamic>> get _filteredCourses {
    return _allCourses.where((course) {
      // 1. Filtre Recherche (insensible à la casse)
      final matchesSearch = course['title'].toString().toLowerCase().contains(_searchQuery.toLowerCase());
      
      // 2. Filtre Catégorie
      // Note : Dans les données, les catégories sont en MAJUSCULES (ex: DESIGN), 
      // donc on compare en mettant tout en majuscules pour être sûr.
      bool matchesCategory = true;
      if (_selectedCategory != "Tout") {
        matchesCategory = course['category'].toString().toUpperCase() == _selectedCategory.toUpperCase();
      }

      return matchesSearch && matchesCategory;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final displayCourses = _filteredCourses;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text("Catalogue des Cours", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: Column(
        children: [
          // --- ZONE DE RECHERCHE & FILTRES ---
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white,
            child: Column(
              children: [
                // 1. Barre de recherche
                TextField(
                  onChanged: (value) {
                    setState(() {
                      _searchQuery = value;
                    });
                  },
                  decoration: InputDecoration(
                    hintText: "Rechercher un cours (ex: React, Design...)",
                    prefixIcon: const Icon(Icons.search, color: Colors.grey),
                    filled: true,
                    fillColor: Colors.grey[100],
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(vertical: 0),
                  ),
                ),
                const SizedBox(height: 15),

                // 2. Filtres Horizontaux (Chips)
                SizedBox(
                  height: 40,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _categories.length,
                    itemBuilder: (context, index) {
                      final category = _categories[index];
                      final isSelected = _selectedCategory == category;
                      return Padding(
                        padding: const EdgeInsets.only(right: 10),
                        child: ChoiceChip(
                          label: Text(category),
                          selected: isSelected,
                          onSelected: (selected) {
                            setState(() {
                              _selectedCategory = category;
                            });
                          },
                          selectedColor: const Color(0xFF6C63FF),
                          backgroundColor: Colors.grey[200],
                          labelStyle: TextStyle(
                            color: isSelected ? Colors.white : Colors.black87,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                          showCheckmark: false,
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          // --- GRILLE DES RÉSULTATS ---
          Expanded(
            child: displayCourses.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.search_off, size: 60, color: Colors.grey[400]),
                        const SizedBox(height: 10),
                        Text("Aucun cours trouvé", style: TextStyle(color: Colors.grey[600], fontSize: 16)),
                      ],
                    ),
                  )
                : Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: GridView.builder(
                      itemCount: displayCourses.length,
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.7, // Ratio ajusté pour bien voir les cartes
                        crossAxisSpacing: 15,
                        mainAxisSpacing: 15,
                      ),
                      itemBuilder: (context, index) {
                        final course = displayCourses[index];
                        // Utilisation du Widget CourseCard corrigé précédemment
                        return GestureDetector(
                          onTap: () {
                             Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => CourseDetailView(course: course),
                              ),
                            );
                          },
                          // Si votre CourseCard gère déjà le OnTap avec le bouton "Voir", 
                          // le GestureDetector ici est optionnel mais permet de cliquer sur toute la carte.
                          child: AbsorbPointer(
                            absorbing: true, // Empêche les conflits si CourseCard a ses propres boutons, sinon mettre false
                            child: CourseCard(course: course),
                          ),
                        );
                      },
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}
