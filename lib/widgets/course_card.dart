import 'package:flutter/material.dart';
// Importez la page de détails pour la navigation
import '../views/courses/course_detail_view.dart';

class CourseCard extends StatelessWidget {
  // On accepte les données sous forme de Map pour être compatible avec votre HomeView
  final Map<String, dynamic> course;

  const CourseCard({super.key, required this.course});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // --- 1. IMAGE ET BADGE ---
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                image: DecorationImage(
                  image: NetworkImage(course['image']),
                  fit: BoxFit.cover, 
                ),
              ),
              child: Stack(
                children: [
                  // Badge "Populaire" (Simulé)
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.amber, // Jaune comme sur la capture
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.star, size: 10, color: Colors.black),
                          SizedBox(width: 4),
                          Text(
                            "Populaire",
                            style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.black),
                          ),
                        ],
                      ),
                    ),
                  ),
                  // Badge Promo (Ex: -30%)
                  if (course['oldPrice'] > course['price'])
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.pink,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text(
                          "-20%", // Vous pouvez calculer le vrai % si vous voulez
                          style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),

          // --- 2. INFORMATIONS ---
          Padding(
            padding: const EdgeInsets.all(10.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Catégorie
                Text(
                  course['category'].toString().toUpperCase(),
                  style: const TextStyle(
                    color: Color(0xFF6C63FF), 
                    fontSize: 10, 
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 4),
                
                // Titre
                Text(
                  course['title'],
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
                const SizedBox(height: 4),
                
                // Formateur
                Text(
                  "Formateur : ${course['instructor']}",
                  style: TextStyle(color: Colors.grey[600], fontSize: 11),
                ),
                
                const SizedBox(height: 8),
                
                // Note (Étoiles)
                Row(
                  children: [
                    Row(
                      children: List.generate(5, (index) {
                        return Icon(
                          index < (course['rating'] as num).round() ? Icons.star : Icons.star_border,
                          color: Colors.amber,
                          size: 14,
                        );
                      }),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      "${course['rating']} (${course['students']})",
                      style: TextStyle(color: Colors.grey[600], fontSize: 10),
                    ),
                  ],
                ),
                
                const SizedBox(height: 10),
                
                // Prix et Bouton
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "${course['oldPrice']} TND",
                          style: const TextStyle(
                            decoration: TextDecoration.lineThrough,
                            color: Colors.grey,
                            fontSize: 11,
                          ),
                        ),
                        Text(
                          "${course['price']} TND",
                          style: const TextStyle(
                            color: Color(0xFFD32F2F), // Rouge prix
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                      ],
                    ),
                    
                    // --- BOUTON VOIR ---
                    SizedBox(
                      height: 32,
                      child: ElevatedButton(
                        onPressed: () {
                          // Navigation vers les détails
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => CourseDetailView(course: course),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF6C63FF),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                        ),
                        child: const Text("Voir", style: TextStyle(fontSize: 12)),
                      ),
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
