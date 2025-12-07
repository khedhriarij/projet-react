import 'package:flutter/material.dart';
// Importez le formulaire complet que je viens de vous donner
// (Assurez-vous que le fichier s'appelle bien add_course_view.dart)
import '../add_course_view.dart';

class AdminCoursesTab extends StatefulWidget {
  const AdminCoursesTab({super.key});

  @override
  State<AdminCoursesTab> createState() => _AdminCoursesTabState();
}

class _AdminCoursesTabState extends State<AdminCoursesTab> {
  // --- DONNÉES DES COURS (Identiques aux captures) ---
  final List<Map<String, dynamic>> coursesData = [
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      
      // --- BOUTON AJOUTER (+) ---
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Ouvre le formulaire en mode CRÉATION (pas d'arguments)
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AddCourseView()),
          );
        },
        backgroundColor: const Color(0xFF6C63FF),
        child: const Icon(Icons.add),
      ),
      
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GridView.builder(
          itemCount: coursesData.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 0.68, // Ajustement pour les boutons
            crossAxisSpacing: 15,
            mainAxisSpacing: 15,
          ),
          itemBuilder: (context, index) {
            final course = coursesData[index];
            return _buildAdminCourseCard(course);
          },
        ),
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
          // Image
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                image: DecorationImage(
                  image: NetworkImage(course['image']),
                  fit: BoxFit.cover, // Adapter selon l'image (contain pour logos)
                ),
                color: Colors.grey[50],
              ),
            ),
          ),
          
          // Contenu
          Padding(
            padding: const EdgeInsets.all(10.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  course['category'],
                  style: const TextStyle(color: Colors.deepPurple, fontSize: 10, fontWeight: FontWeight.bold),
                ),
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
                const SizedBox(height: 10),
                
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // --- BOUTON MODIFIER ---
                    OutlinedButton.icon(
                      onPressed: () {
                        // Ouvre le formulaire en mode ÉDITION (avec arguments)
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => AddCourseView(courseToEdit: course),
                          ),
                        );
                      },
                      icon: const Icon(Icons.edit, size: 14, color: Color(0xFF6C63FF)),
                      label: const Text("Modifier", style: TextStyle(fontSize: 12, color: Color(0xFF6C63FF))),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 0),
                        side: const BorderSide(color: Color(0xFF6C63FF)),
                      ),
                    ),
                    
                    // --- BOUTON SUPPRIMER ---
                    IconButton(
                      icon: const Icon(Icons.delete_outline, color: Colors.red, size: 20),
                      onPressed: () {
                        // Simulation suppression
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text("Cours supprimé (Simulation)")),
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
