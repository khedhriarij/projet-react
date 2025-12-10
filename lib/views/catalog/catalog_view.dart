import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import '../../widgets/course_card.dart'; // Assure-toi que ce widget existe
import '../courses/course_detail_view.dart';

class CatalogView extends StatefulWidget {
  const CatalogView({super.key});

  @override
  State<CatalogView> createState() => _CatalogViewState();
}

class _CatalogViewState extends State<CatalogView> {
  String _searchQuery = "";
  String _selectedCategory = "Tout";
  String _selectedSort = "Par défaut";

  final List<String> _categories = [
    "Tout",
    "Design",
    "Développement",
    "Business",
    "Marketing",
  ];

  final List<String> _sortOptions = [
    "Par défaut",
    "Prix croissant",
    "Prix décroissant",
    "Plus populaire",
  ];

  // --- LOGIQUE DE TRI ET FILTRE ---
  List<Map<String, dynamic>> _filterAndSortCourses(
      List<Map<String, dynamic>> allCourses) {
    // 1. Filtrage (Recherche + Catégorie)
    List<Map<String, dynamic>> result = allCourses.where((course) {
      final title = course['title']?.toString().toLowerCase() ?? '';
      final matchesSearch = title.contains(_searchQuery.toLowerCase());

      bool matchesCategory = true;
      if (_selectedCategory != "Tout") {
        final cat = course['category']?.toString().toUpperCase() ?? '';
        matchesCategory = cat == _selectedCategory.toUpperCase();
      }

      return matchesSearch && matchesCategory;
    }).toList();

    // 2. Tri (Prix, Popularité)
    switch (_selectedSort) {
      case "Prix croissant":
        result.sort((a, b) =>
            ((a['price'] ?? 0) as num).compareTo((b['price'] ?? 0) as num));
        break;
      case "Prix décroissant":
        result.sort((a, b) =>
            ((b['price'] ?? 0) as num).compareTo((a['price'] ?? 0) as num));
        break;
      case "Plus populaire":
        result.sort((a, b) {
          final ratingDiff =
              ((b['rating'] ?? 0) as num).compareTo((a['rating'] ?? 0) as num);
          if (ratingDiff != 0) return ratingDiff;
          return ((b['students'] ?? 0) as num)
              .compareTo((a['students'] ?? 0) as num);
        });
        break;
      case "Par défaut":
      default:
        break;
    }

    return result;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA), // Fond gris très clair
      appBar: AppBar(
        title: const Text(
          "Catalogue des Cours",
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: Column(
        children: [
          // --- ZONE DE FILTRES (Blanc) ---
          Container(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            color: Colors.white,
            child: Column(
              children: [
                // 1. Barre de recherche (Style arrondi gris)
                TextField(
                  onChanged: (value) {
                    setState(() => _searchQuery = value);
                  },
                  decoration: InputDecoration(
                    hintText: "Rechercher un cours...",
                    hintStyle: TextStyle(color: Colors.grey[500]),
                    prefixIcon: Icon(Icons.search, color: Colors.grey[500]),
                    filled: true,
                    fillColor: const Color(
                        0xFFF3F4F6), // Gris clair comme sur la photo
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(vertical: 0),
                  ),
                ),
                const SizedBox(height: 12),

                // 2. Ligne Catégories + Tri
                Row(
                  children: [
                    // Liste horizontale des catégories
                    Expanded(
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: _categories.map((cat) {
                            final isSelected = _selectedCategory == cat;
                            return Padding(
                              padding: const EdgeInsets.only(right: 8.0),
                              child: ChoiceChip(
                                label: Text(cat),
                                selected: isSelected,
                                onSelected: (_) {
                                  setState(() => _selectedCategory = cat);
                                },
                                // Couleurs exactes de la photo (Violet si sélectionné, Gris sinon)
                                selectedColor: const Color(0xFF6C63FF),
                                backgroundColor: const Color(0xFFF3F4F6),
                                labelStyle: TextStyle(
                                  color: isSelected
                                      ? Colors.white
                                      : Colors.black87,
                                  fontWeight: isSelected
                                      ? FontWeight.bold
                                      : FontWeight.normal,
                                ),
                                showCheckmark:
                                    false, // Pas de coche, juste la couleur
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                  side: BorderSide.none, // Pas de bordure
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ),

                    const SizedBox(width: 8),

                    // Bouton Tri (Dropdown compact)
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 0),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF3F4F6),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: _selectedSort,
                          icon: const Icon(Icons.arrow_drop_down,
                              color: Colors.black54),
                          items: _sortOptions
                              .map((s) => DropdownMenuItem(
                                    value: s,
                                    child: Text(s,
                                        style: const TextStyle(
                                            fontSize: 13,
                                            color: Colors.black87)),
                                  ))
                              .toList(),
                          onChanged: (value) {
                            if (value == null) return;
                            setState(() => _selectedSort = value);
                          },
                          dropdownColor: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // --- GRILLE DES COURS ---
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream:
                  FirebaseFirestore.instance.collection('courses').snapshots(),
              builder: (context, snapshot) {
                if (snapshot.hasError) {
                  return Center(
                      child: Text("Erreur de chargement",
                          style: TextStyle(color: Colors.red[300])));
                }
                if (!snapshot.hasData) {
                  return const Center(child: CircularProgressIndicator());
                }

                // Récupération + Mapping ID
                final allCourses = snapshot.data!.docs.map((doc) {
                  final data = doc.data() as Map<String, dynamic>;
                  return {...data, 'id': doc.id};
                }).toList();

                // Filtrage Local
                final courses = _filterAndSortCourses(allCourses);

                if (courses.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.search_off,
                            size: 64, color: Colors.grey[300]),
                        const SizedBox(height: 16),
                        Text(
                          "Aucun cours trouvé.",
                          style:
                              TextStyle(color: Colors.grey[500], fontSize: 16),
                        ),
                      ],
                    ),
                  );
                }

                return Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: GridView.builder(
                    itemCount: courses.length,
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.75, // Ajusté pour éviter l'overflow
                      crossAxisSpacing: 15,
                      mainAxisSpacing: 15,
                    ),
                    itemBuilder: (context, index) {
                      final course = courses[index];
                      return GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => CourseDetailView(course: course),
                            ),
                          );
                        },
                        child: CourseCard(course: course),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
