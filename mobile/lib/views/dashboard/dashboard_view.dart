import 'package:flutter/material.dart';
import '../../widgets/drawer_widget.dart';

class DashboardView extends StatelessWidget {
  const DashboardView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mon Tableau de Bord')),
      drawer: const AppDrawer(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Bonjour, prêt à apprendre ? 👋", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            
            // Stats
            Row(
              children: [
                _buildStatCard("Cours Inscrits", "3", Icons.class_, Colors.blue),
                const SizedBox(width: 10),
                _buildStatCard("Terminés", "1", Icons.check_circle, Colors.green),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                _buildStatCard("Heures", "15h", Icons.timer, Colors.orange),
                const SizedBox(width: 10),
                _buildStatCard("Certificats", "1", Icons.workspace_premium, Colors.purple),
              ],
            ),
            const SizedBox(height: 30),

            // Cours en cours
            _buildSectionHeader("Mes Cours en Cours", () => Navigator.pushNamed(context, '/my-courses')),
            const SizedBox(height: 10),
            _buildCourseProgressCard("React Avancé", 0.65, "Il y a 2 jours", Colors.blueAccent),
            _buildCourseProgressCard("UI/UX Design", 0.30, "Il y a 1 semaine", Colors.purpleAccent),
            const SizedBox(height: 30),

            // Activité récente
            const Text("Activité Récente", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Column(
                children: [
                  _buildActivityItem(Icons.play_circle_filled, "Chapitre terminé : Hooks", "Il y a 2 jours", Colors.blue),
                  const Divider(height: 1),
                  _buildActivityItem(Icons.quiz, "Quiz UI/UX : Score 85%", "Il y a 3 jours", Colors.orange),
                  const Divider(height: 1),
                  _buildActivityItem(Icons.emoji_events, "Certificat JavaScript obtenu", "Il y a 1 semaine", Colors.green),
                ],
              ),
            ),
            const SizedBox(height: 30),

            // Recommandations
            _buildSectionHeader("Cours Recommandés", () => Navigator.pushNamed(context, '/home')),
            const SizedBox(height: 10),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF6C63FF).withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF6C63FF).withOpacity(0.3)),
              ),
              child: Column(
                children: [
                  const Icon(Icons.auto_awesome, size: 40, color: Color(0xFF6C63FF)),
                  const SizedBox(height: 10),
                  const Text("Découvrez de nouveaux horizons", style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 5),
                  const Text("Python Data Science, Gestion Agile...", style: TextStyle(color: Colors.grey)),
                  const SizedBox(height: 15),
                  ElevatedButton(
                    onPressed: () => Navigator.pushNamed(context, '/home'),
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6C63FF)),
                    child: const Text("Explorer le catalogue", style: TextStyle(color: Colors.white)),
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 5, spreadRadius: 1)],
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, VoidCallback onTap) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        TextButton(onPressed: onTap, child: const Text("Voir tout")),
      ],
    );
  }

  Widget _buildCourseProgressCard(String title, double progress, String lastAccessed, Color color) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 5),
            Text(lastAccessed, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
            const SizedBox(height: 10),
            LinearProgressIndicator(value: progress, color: color, backgroundColor: color.withOpacity(0.1), minHeight: 6),
            const SizedBox(height: 5),
            Align(alignment: Alignment.centerRight, child: Text("${(progress * 100).toInt()}%", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold))),
          ],
        ),
      ),
    );
  }

  Widget _buildActivityItem(IconData icon, String title, String time, Color color) {
    return ListTile(
      leading: CircleAvatar(backgroundColor: color.withOpacity(0.1), child: Icon(icon, color: color, size: 20)),
      title: Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
      trailing: Text(time, style: const TextStyle(fontSize: 12, color: Colors.grey)),
    );
  }
}
