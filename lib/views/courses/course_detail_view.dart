import 'package:flutter/material.dart';

class CourseDetailView extends StatelessWidget {
  // On reçoit les données du cours sous forme de Map pour l'instant
  final Map<String, dynamic> course;

  const CourseDetailView({super.key, required this.course});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // --- IMAGE EN HAUT (SliverAppBar) ---
          SliverAppBar(
            expandedHeight: 250.0,
            pinned: true,
            backgroundColor: const Color(0xFF6C63FF),
            flexibleSpace: FlexibleSpaceBar(
              background: Image.network(
                course['image'],
                fit: BoxFit.cover,
              ),
            ),
          ),

          // --- CONTENU ---
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Badge Catégorie
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF6C63FF).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      course['category'],
                      style: const TextStyle(color: Color(0xFF6C63FF), fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 15),

                  // Titre
                  Text(
                    course['title'],
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),

                  // Formateur et Note
                  Row(
                    children: [
                      const CircleAvatar(radius: 15, child: Icon(Icons.person, size: 15)),
                      const SizedBox(width: 8),
                      Text(course['instructor'], style: const TextStyle(fontWeight: FontWeight.w500)),
                      const Spacer(),
                      const Icon(Icons.star, color: Colors.amber, size: 20),
                      Text(" ${course['rating']} (${course['students']} avis)"),
                    ],
                  ),
                  const SizedBox(height: 20),
                  const Divider(),
                  const SizedBox(height: 20),

                  // Prix
                  Row(
                    children: [
                      Text(
                        "${course['oldPrice']} TND",
                        style: const TextStyle(
                          decoration: TextDecoration.lineThrough,
                          color: Colors.grey,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(width: 15),
                      Text(
                        "${course['price']} TND",
                        style: const TextStyle(
                          color: Colors.red,
                          fontWeight: FontWeight.bold,
                          fontSize: 32,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 30),

                  // Description (Simulation)
                  const Text(
                    "Description du cours",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    "Apprenez à maîtriser ${course['title']} de A à Z. "
                    "Ce cours complet couvre toutes les notions fondamentales et avancées "
                    "pour vous permettre de devenir un expert en ${course['category'].toString().toLowerCase()}. "
                    "Inclus : exercices pratiques, quiz et certification finale.",
                    style: TextStyle(color: Colors.grey[700], height: 1.5),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      
      // --- BOUTON ACHETER (FIXE EN BAS) ---
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: const Offset(0, -5))],
        ),
        child: ElevatedButton(
          onPressed: () {
            // Logique de paiement ou d'inscription
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("Redirection vers le paiement...")),
            );
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF6C63FF),
            padding: const EdgeInsets.symmetric(vertical: 15),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
          child: const Text("Acheter maintenant", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }
}
