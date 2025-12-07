import 'package:flutter/material.dart';
// Importez la vue détail (assurez-vous d'avoir créé le fichier course_detail_view.dart)
import '../courses/course_detail_view.dart';
import '../../widgets/drawer_widget.dart'; // Si vous voulez le menu

class HomeView extends StatefulWidget {
  const HomeView({super.key});

  @override
  State<HomeView> createState() => _HomeViewState();
}

class _HomeViewState extends State<HomeView> {
  // --- DONNÉES DES COURS ---
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
      backgroundColor: const Color(0xFFF5F7FA), // Fond gris clair
      appBar: AppBar(
        title: const Text("Plateforme Éducative", style: TextStyle(color: Colors.black)),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      drawer: const AppDrawer(), // Le menu latéral étudiant
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GridView.builder(
          itemCount: coursesData.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 0.7, 
            crossAxisSpacing: 15,
            mainAxisSpacing: 15,
          ),
          itemBuilder: (context, index) {
            final course = coursesData[index];
            return _buildCourseCard(course);
          },
        ),
      ),
    );
  }

  Widget _buildCourseCard(Map<String, dynamic> course) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 5, offset: const Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                image: DecorationImage(
                  image: NetworkImage(course['image']),
                  fit: BoxFit.cover, // Utilisez contain si l'image est coupée
                ),
              ),
              child: Stack(
                children: [
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(color: Colors.yellow[700], borderRadius: BorderRadius.circular(10)),
                      child: const Text("Populaire", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(10.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(course['category'], style: const TextStyle(color: Colors.deepPurple, fontSize: 10, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(course['title'], maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 4),
                Text("Formateur : ${course['instructor']}", style: TextStyle(color: Colors.grey[600], fontSize: 10)),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.star, color: Colors.amber, size: 14),
                    Text(" ${course['rating']} (${course['students']})", style: const TextStyle(fontSize: 10)),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("${course['oldPrice']} TND", style: const TextStyle(decoration: TextDecoration.lineThrough, color: Colors.grey, fontSize: 10)),
                        Text("${course['price']} TND", style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 16)),
                      ],
                    ),
                    
                    // --- BOUTON VOIR CONNECTÉ ---
                    SizedBox(
                      height: 30,
                      child: ElevatedButton(
                        onPressed: () {
                          // NAVIGATION VERS DETAIL
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => CourseDetailView(course: course),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6C63FF), padding: const EdgeInsets.symmetric(horizontal: 10)),
                        child: const Text("Voir", style: TextStyle(fontSize: 12)),
                      ),
                    ),
                    // -----------------------------
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
