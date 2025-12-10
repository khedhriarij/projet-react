import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import '../add_course_view.dart';

class AdminCoursesTab extends StatefulWidget {
  const AdminCoursesTab({super.key});

  @override
  State<AdminCoursesTab> createState() => _AdminCoursesTabState();
}

class _AdminCoursesTabState extends State<AdminCoursesTab> {
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

  // --- FONCTION DE SUPPRESSION ---
  Future<void> _deleteCourse(String courseId) async {
    try {
      await FirebaseFirestore.instance.collection('courses').doc(courseId).delete();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Cours supprimé avec succès"), backgroundColor: Colors.red),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Erreur lors de la suppression: $e"), backgroundColor: Colors.red),
        );
      }
    }
  }

  // --------- FILTRAGE + TRI ----------
  List<Map<String, dynamic>> _filterAndSort(
    List<Map<String, dynamic>> allCourses,
  ) {
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
      backgroundColor: const Color(0xFFF5F7FA),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AddCourseView()),
          );
        },
        backgroundColor: const Color(0xFF6C63FF),
        child: const Icon(Icons.add),
      ),
      body: Column(
        children: [
          // Barre recherche + filtres
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white,
            child: Column(
              children: [
                TextField(
                  onChanged: (value) {
                    setState(() => _searchQuery = value);
                  },
                  decoration: InputDecoration(
                    hintText: "Rechercher un cours...",
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
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: SizedBox(
                        height: 36,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: _categories.length,
                          itemBuilder: (context, index) {
                            final cat = _categories[index];
                            final selected = _selectedCategory == cat;
                            return Padding(
                              padding: const EdgeInsets.only(right: 8.0),
                              child: ChoiceChip(
                                label: Text(cat),
                                selected: selected,
                                onSelected: (_) {
                                  setState(() => _selectedCategory = cat);
                                },
                                selectedColor: const Color(0xFF6C63FF),
                                backgroundColor: Colors.grey[200],
                                labelStyle: TextStyle(
                                  color: selected ? Colors.white : Colors.black,
                                  fontWeight: selected ? FontWeight.bold : FontWeight.normal,
                                ),
                                showCheckmark: false,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    DropdownButtonHideUnderline(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        decoration: BoxDecoration(
                          color: Colors.grey[100],
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: DropdownButton<String>(
                          value: _selectedSort,
                          items: _sortOptions.map((s) => DropdownMenuItem(value: s, child: Text(s, style: const TextStyle(fontSize: 12)))).toList(),
                          onChanged: (value) {
                            if (value == null) return;
                            setState(() => _selectedSort = value);
                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Liste des cours depuis Firestore
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: StreamBuilder<QuerySnapshot>(
                stream: FirebaseFirestore.instance.collection('courses').snapshots(),
                builder: (context, snapshot) {
                  if (snapshot.hasError) {
                    return Center(child: Text("Erreur de chargement", style: TextStyle(color: Colors.red[700])));
                  }
                  if (!snapshot.hasData) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  final allCourses = snapshot.data!.docs.map((doc) {
                    final data = doc.data() as Map<String, dynamic>? ?? {};
                    return {
                      'id': doc.id,
                      'title': data['title'] ?? '',
                      'category': data['category'] ?? '',
                      'instructor': data['instructor'] ?? '',
                      'rating': data['rating'] ?? 0.0,
                      'students': data['students'] ?? 0,
                      'price': data['price'] ?? 0.0,
                      'originalPrice': data['originalPrice'],
                      'image': data['image'] ?? '',
                      'level': data['level'] ?? '',
                      'duration': data['duration'] ?? '',
                      'description': data['description'] ?? '',
                    };
                  }).toList();

                  final courses = _filterAndSort(allCourses);

                  if (courses.isEmpty) {
                    return Center(child: Text("Aucun cours trouvé.", style: TextStyle(color: Colors.grey[600])));
                  }

                  return GridView.builder(
                    itemCount: courses.length,
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.68,
                      crossAxisSpacing: 15,
                      mainAxisSpacing: 15,
                    ),
                    itemBuilder: (context, index) {
                      final course = courses[index];
                      return _buildAdminCourseCard(course);
                    },
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAdminCourseCard(Map<String, dynamic> course) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                image: (course['image'] != null && course['image'].toString().isNotEmpty)
                    ? DecorationImage(
                        image: NetworkImage(course['image']),
                        fit: BoxFit.cover,
                      )
                    : null,
                color: Colors.grey[300],
              ),
              child: (course['image'] == null || course['image'].toString().isEmpty)
                  ? const Center(child: Icon(Icons.image_not_supported, color: Colors.white))
                  : null,
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(10.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  course['category'].toString().toUpperCase(),
                  style: const TextStyle(color: Colors.deepPurple, fontSize: 10, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  course['title'],
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
                const SizedBox(height: 4),
                Text(
                  "${course['price']} TND",
                  style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 14),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    OutlinedButton.icon(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => AddCourseView(courseToEdit: course)),
                        );
                      },
                      icon: const Icon(Icons.edit, size: 14, color: Color(0xFF6C63FF)),
                      label: const Text("Modifier", style: TextStyle(fontSize: 12, color: Color(0xFF6C63FF))),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 0),
                        side: const BorderSide(color: Color(0xFF6C63FF)),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete_outline, color: Colors.red, size: 20),
                      onPressed: () {
                        // Boîte de dialogue de confirmation
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text("Confirmer"),
                            content: const Text("Voulez-vous vraiment supprimer ce cours ?"),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text("Annuler"),
                              ),
                              TextButton(
                                onPressed: () {
                                  Navigator.pop(context);
                                  _deleteCourse(course['id']); // Appel de la vraie suppression
                                },
                                style: TextButton.styleFrom(foregroundColor: Colors.red),
                                child: const Text("Supprimer"),
                              ),
                            ],
                          ),
                        );
                      },
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
