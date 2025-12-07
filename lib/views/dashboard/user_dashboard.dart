import 'package:flutter/material.dart';
import '../home/home_view.dart';
import '../courses/my_courses_view.dart';
import '../profile/profile_view.dart';

class UserDashboard extends StatefulWidget {
  const UserDashboard({super.key});

  @override
  State<UserDashboard> createState() => _UserDashboardState();
}

class _UserDashboardState extends State<UserDashboard> {
  int _currentIndex = 0;
  
  // Liste des pages accessibles via la barre de navigation
  final List<Widget> _pages = [
    const HomeView(),           // 0: Accueil
    const Center(child: Text("Recherche (À venir)")), // 1: Recherche (Placeholder)
    const MyCoursesView(),      // 2: Mes Cours
    const ProfileView(),        // 3: Profil
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Affiche la page correspondant à l'index actuel
      body: _pages[_currentIndex],
      
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed, // Pour avoir plus de 3 items stables
        selectedItemColor: const Color(0xFF6C63FF), // Ta couleur violette
        unselectedItemColor: Colors.grey,
        showUnselectedLabels: true,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Accueil',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: 'Recherche',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.play_circle_outline),
            label: 'Mes Cours',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}
