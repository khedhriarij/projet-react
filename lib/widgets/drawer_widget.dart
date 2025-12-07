import 'package:flutter/material.dart';
// Assurez-vous que ces chemins sont corrects selon VOTRE projet
import '../views/courses/my_courses_view.dart';
import '../views/dashboard/user_dashboard.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          // En-tête du menu
          const DrawerHeader(
            decoration: BoxDecoration(
              color: Color(0xFF6C63FF), // Violet LearnUp
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Icon(Icons.school, color: Colors.white, size: 40),
                SizedBox(height: 10),
                Text(
                  "LearnUp Menu",
                  style: TextStyle(color: Colors.white, fontSize: 24),
                ),
              ],
            ),
          ),

          // 1. Catalogue (Accueil)
          ListTile(
            leading: const Icon(Icons.store),
            title: const Text("Catalogue (Accueil)"),
            onTap: () {
              Navigator.pop(context); // Ferme le drawer d'abord
              
              // Si vous utilisez des routes nommées dans main.dart
              // Navigator.pushReplacementNamed(context, '/user_dashboard');
              
              // Sinon, navigation directe (plus sûr si routes pas configurées)
              Navigator.pushReplacement(
                context, 
                MaterialPageRoute(builder: (_) => const UserDashboard())
              );
            },
          ),

          // 2. Mon Tableau de Bord
          ListTile(
            leading: const Icon(Icons.dashboard),
            title: const Text("Mon Tableau de Bord"),
            onTap: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Tableau de bord étudiant en construction")),
              );
            },
          ),

          // 3. Mes Cours Achetés
          ListTile(
            leading: const Icon(Icons.menu_book),
            title: const Text("Mes Cours Achetés"),
            onTap: () {
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const MyCoursesView()),
              );
            },
          ),
        ],
      ),
    );
  }
}
