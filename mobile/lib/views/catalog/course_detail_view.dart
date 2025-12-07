import 'package:flutter/material.dart';
import '../../models/course_model.dart';

class CourseDetailView extends StatelessWidget {
  final CourseModel course;

  const CourseDetailView({super.key, required this.course});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Barre d'en-tête élastique avec l'image
          SliverAppBar(
            expandedHeight: 250.0,
            pinned: true, // La barre reste visible quand on scrolle
            backgroundColor: const Color(0xFF6C63FF),
            iconTheme: const IconThemeData(color: Colors.white),
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                course.title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  shadows: [Shadow(color: Colors.black45, blurRadius: 10)],
                ),
              ),
              background: Image.network(
                course.image,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  color: Colors.grey,
                  child: const Center(child: Icon(Icons.image_not_supported, color: Colors.white)),
                ),
              ),
            ),
          ),

          // Contenu de la page
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Badges (Catégorie + Niveau)
                  Row(
                    children: [
                      _buildBadge(course.category, Colors.blue.shade100, Colors.blue.shade900),
                      const SizedBox(width: 10),
                      _buildBadge(course.level, Colors.orange.shade100, Colors.orange.shade900),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Titre et Prix
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Text(
                          course.title,
                          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, height: 1.3),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        '${course.price} TND',
                        style: const TextStyle(
                          fontSize: 22, 
                          fontWeight: FontWeight.bold, 
                          color: Color(0xFF6C63FF)
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // Note et Participants
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 20),
                      const SizedBox(width: 4),
                      Text(
                        '${course.rating}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '(${course.students} étudiants)',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                    ],
                  ),
                  const Divider(height: 40),

                  // Infos Formateur
                  Row(
                    children: [
                      const CircleAvatar(
                        backgroundColor: Color(0xFF6C63FF),
                        child: Icon(Icons.person, color: Colors.white),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Enseigné par ${course.instructor}",
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                          ),
                          const Text("Expert Certifié", style: TextStyle(color: Colors.grey, fontSize: 12)),
                        ],
                      )
                    ],
                  ),
                  const Divider(height: 40),

                  // Description
                  const Text(
                    "Description",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    course.description.isNotEmpty 
                        ? course.description 
                        : "Aucune description disponible pour ce cours.",
                    style: TextStyle(fontSize: 15, height: 1.6, color: Colors.grey[800]),
                  ),
                  
                  const SizedBox(height: 20),

                  // Détails techniques (Durée, etc.)
                  _buildInfoRow(Icons.timer_outlined, "Durée du cours", course.duration),
                  _buildInfoRow(Icons.language, "Langue", "Français"),
                  _buildInfoRow(Icons.all_inclusive, "Accès illimité", "Oui"),
                  _buildInfoRow(Icons.verified_outlined, "Certificat", "Inclus"),

                  const SizedBox(height: 80), // Espace pour le bouton flottant
                ],
              ),
            ),
          ),
        ],
      ),
      
      // Bouton d'action en bas (Fixe)
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5)),
          ],
        ),
        child: SafeArea(
          child: ElevatedButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Inscription réussie ! (Simulation)'),
                  backgroundColor: Colors.green,
                )
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6C63FF),
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 0,
            ),
            child: const Text(
              "S'inscrire maintenant",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBadge(String text, Color bgColor, Color textColor) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(5),
      ),
      child: Text(
        text.toUpperCase(),
        style: TextStyle(color: textColor, fontSize: 10, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(icon, size: 22, color: Colors.grey[600]),
          const SizedBox(width: 12),
          Text(label, style: TextStyle(color: Colors.grey[600], fontSize: 15)),
          const Spacer(),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
        ],
      ),
    );
  }
}
