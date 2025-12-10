import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

// Import des nouveaux services
import '../../services/payment_service.dart';
import '../../repositories/enrollment_repository.dart';
import '../payment/payment_webview.dart';

class CourseDetailView extends StatelessWidget {
  // Changement ici : on accepte un Map
  final Map<String, dynamic> course;

  const CourseDetailView({super.key, required this.course});

  Future<void> _startPayment(BuildContext context) async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vous devez être connecté pour acheter un cours.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // Récupération sécurisée des données depuis la Map
    final double price = (course['price'] as num).toDouble();
    final String title = course['title'] ?? 'Cours sans titre';
    final String courseId = course['id'].toString();
    
    // Génération d'un Order ID unique pour Paymee
    final String orderId = "COURSE_${courseId}_${DateTime.now().millisecondsSinceEpoch}";

    // 1. Création du paiement via le service Paymee
    final paymentData = await PaymentService().createPayment(
      amount: price,
      courseTitle: title,
      orderId: orderId,
      // On utilise les vraies infos du user Firebase
      firstName: user.displayName?.split(' ')[0] ?? "Client",
      lastName: user.displayName?.split(' ').skip(1).join(' ') ?? "App",
      email: user.email ?? "client@email.com",
      phoneNumber: "20000000", // Idéalement à récupérer du profil user
    );

    if (paymentData == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Erreur lors de l\'initialisation du paiement Paymee'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // 2. Ouverture de la WebView de paiement
    final bool success = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => PaymentWebView(
          paymentUrl: paymentData['payment_url'],
          paymentToken: paymentData['token'],
        ),
      ),
    );

    // 3. Traitement du résultat
    if (success) {
      try {
        await EnrollmentRepository().enrollAfterPayment(
          userId: user.uid,
          courseId: courseId,
        );

        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Paiement réussi, cours débloqué !'),
              backgroundColor: Colors.green,
            ),
          );
        }
      } catch (e) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Paiement validé mais erreur d\'enregistrement: $e'),
              backgroundColor: Colors.orange,
            ),
          );
        }
      }
    } else {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Paiement annulé ou non validé.'),
            backgroundColor: Colors.orange,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // Extraction des données de la Map pour l'affichage
    final String image = course['image'] ?? '';
    final String title = course['title'] ?? 'Sans titre';
    final String category = course['category'] ?? 'Général';
    final String level = course['level'] ??
        'Tous niveaux'; // S'assurer que 'level' existe dans ta Map, sinon valeur par défaut
    final String priceStr = "${course['price']} TND";
    final String rating = "${course['rating'] ?? 0.0}";
    final String students = "${course['students'] ?? 0}";
    final String instructor = course['instructor'] ?? 'Inconnu';
    final String description = course['description'] ?? 'Aucune description.';
    final String duration = course['duration'] ?? 'Non spécifiée'; // Pareil pour duration

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 250.0,
            pinned: true,
            backgroundColor: const Color(0xFF6C63FF),
            iconTheme: const IconThemeData(color: Colors.white),
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  shadows: [Shadow(color: Colors.black45, blurRadius: 10)],
                ),
              ),
              background: Image.network(
                image,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  color: Colors.grey,
                  child: const Center(
                    child: Icon(Icons.image_not_supported, color: Colors.white),
                  ),
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      _buildBadge(category, Colors.blue.shade100,
                          Colors.blue.shade900),
                      const SizedBox(width: 10),
                      _buildBadge(level, Colors.orange.shade100,
                          Colors.orange.shade900),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Text(
                          title,
                          style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              height: 1.3),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        priceStr,
                        style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF6C63FF)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 20),
                      const SizedBox(width: 4),
                      Text(rating,
                          style: const TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 16)),
                      const SizedBox(width: 8),
                      Text('($students étudiants)',
                          style: TextStyle(color: Colors.grey[600])),
                    ],
                  ),
                  const Divider(height: 40),
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
                          Text("Enseigné par $instructor",
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 15)),
                          const Text("Expert Certifié",
                              style:
                                  TextStyle(color: Colors.grey, fontSize: 12)),
                        ],
                      )
                    ],
                  ),
                  const Divider(height: 40),
                  const Text("Description",
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),
                  Text(description,
                      style: TextStyle(
                          fontSize: 15, height: 1.6, color: Colors.grey[800])),
                  const SizedBox(height: 20),
                  _buildInfoRow(
                      Icons.timer_outlined, "Durée du cours", duration),
                  _buildInfoRow(Icons.language, "Langue", "Français"),
                  _buildInfoRow(Icons.all_inclusive, "Accès illimité", "Oui"),
                  _buildInfoRow(
                      Icons.verified_outlined, "Certificat", "Inclus"),
                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, -5))
          ],
        ),
        child: SafeArea(
          child: ElevatedButton(
            onPressed: () => _startPayment(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6C63FF),
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
              elevation: 0,
            ),
            child: const Text("S'inscrire maintenant",
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white)),
          ),
        ),
      ),
    );
  }

  Widget _buildBadge(String text, Color bgColor, Color textColor) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
          color: bgColor, borderRadius: BorderRadius.circular(5)),
      child: Text(text.toUpperCase(),
          style: TextStyle(
              color: textColor, fontSize: 10, fontWeight: FontWeight.bold)),
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
          Text(value,
              style:
                  const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
        ],
      ),
    );
  }
}
