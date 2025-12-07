import 'package:flutter/material.dart';
import '../../widgets/drawer_widget.dart';

class MyCoursesView extends StatelessWidget {
  const MyCoursesView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mes Cours Achetés')),
      drawer: const AppDrawer(),
      body: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            color: const Color(0xFF6C63FF),
            child: const Column(
              children: [
                Text("Mes Cours", style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                Text("Continuez votre apprentissage", style: TextStyle(color: Colors.white70)),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _buildMyCourseItem("Maîtriser Flutter", "Jean Dupont", "https://storage.googleapis.com/cms-storage-bucket/70760bf1e88b184bb1bc.png", 0.45),
                _buildMyCourseItem("UI/UX Design", "Marie Curie", "https://s3-alpha.figma.com/hub/file/1166690750/85f69649-5387-44c2-ba45-81f1383d7945-cover.png", 0.10),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMyCourseItem(String title, String instructor, String imageUrl, double progress) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Column(
        children: [
          ClipRRect(borderRadius: const BorderRadius.vertical(top: Radius.circular(12)), child: Image.network(imageUrl, height: 120, width: double.infinity, fit: BoxFit.cover)),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                Text("Formateur: $instructor", style: const TextStyle(color: Colors.grey)),
                const SizedBox(height: 10),
                LinearProgressIndicator(value: progress, color: const Color(0xFF6C63FF), backgroundColor: Colors.grey[200]),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6C63FF)),
                    child: const Text("Continuer", style: TextStyle(color: Colors.white)),
                  ),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}
