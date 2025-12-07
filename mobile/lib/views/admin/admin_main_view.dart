import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

// Importez vos onglets (assurez-vous que ces fichiers existent)
import 'tabs/admin_overview_tab.dart'; // Dashboard stats
import 'tabs/admin_courses_tab.dart'; // Gestion des cours
import 'tabs/admin_users_tab.dart'; // Gestion utilisateurs

class AdminMainView extends StatefulWidget {
  const AdminMainView({super.key});

  @override
  State<AdminMainView> createState() => _AdminMainViewState();
}

class _AdminMainViewState extends State<AdminMainView> {
  // Index de l'onglet sélectionné (0 = Vue d'ensemble)
  int _selectedIndex = 0;

  // Liste des titres de la page selon l'onglet
  final List<String> _titles = [
    "Tableau de Bord",
    "Gestion des Cours",
    "Utilisateurs",
    "Paramètres"
  ];

  // Liste des Vues (Onglets) à afficher
  final List<Widget> _widgetOptions = <Widget>[
    const AdminOverviewTab(), // Index 0
    const AdminCoursesTab(), // Index 1
    const AdminUsersTab(), // Index 2
    const Center(child: Text("Paramètres (À implémenter)")), // Index 3
  ];

  // Fonction pour gérer la déconnexion
  Future<void> _handleLogout() async {
    try {
      await FirebaseAuth.instance.signOut();
      // Le StreamBuilder de main.dart gérera la redirection,
      // mais on peut forcer la fermeture du dashboard pour être propre.
      if (mounted) {
        Navigator.of(context).popUntil((route) => route.isFirst);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Erreur déconnexion: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA), // Fond gris clair pro

      // --- APP BAR ---
      appBar: AppBar(
        title: Text(
          _titles[_selectedIndex],
          style:
              const TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        elevation: 1,
        iconTheme: const IconThemeData(color: Colors.black),
        actions: [
          // --- BOUTON DÉCONNEXION (PORTE ROUGE) ---
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.red),
            tooltip: "Se déconnecter",
            onPressed: () {
              // Boîte de dialogue de confirmation
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text("Déconnexion"),
                  content: const Text(
                      "Voulez-vous vraiment quitter l'espace admin ?"),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text("Annuler"),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.pop(context);
                        _handleLogout(); // Appel de la déconnexion
                      },
                      child: const Text("Déconnecter",
                          style: TextStyle(color: Colors.red)),
                    ),
                  ],
                ),
              );
            },
          ),
          const SizedBox(width: 10),
        ],
      ),

      // --- MENU LATÉRAL (DRAWER VIOLET) ---
      drawer: Drawer(
        child: Container(
          color: const Color(0xFF6C63FF), // Violet LearnUp
          child: ListView(
            padding: EdgeInsets.zero,
            children: [
              // Header du Drawer
              const DrawerHeader(
                decoration: BoxDecoration(
                  color: Color(0xFF5a52d5), // Violet un peu plus foncé
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.admin_panel_settings,
                        size: 50, color: Colors.white),
                    SizedBox(height: 10),
                    Text(
                      "Espace Admin",
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold),
                    ),
                    Text(
                      "eyabayoudh@gmail.com",
                      style: TextStyle(color: Colors.white70, fontSize: 14),
                    ),
                  ],
                ),
              ),

              // Items du Menu
              _buildDrawerItem(0, "Vue d'ensemble", Icons.dashboard),
              _buildDrawerItem(1, "Cours", Icons.book),
              _buildDrawerItem(2, "Utilisateurs", Icons.people),
              const Divider(color: Colors.white24),
              _buildDrawerItem(3, "Paramètres", Icons.settings),
            ],
          ),
        ),
      ),

      // --- CORPS DE LA PAGE (CONTENU VARIABLE) ---
      body: _widgetOptions[_selectedIndex],
    );
  }

  // Widget utilitaire pour construire les items du menu
  Widget _buildDrawerItem(int index, String title, IconData icon) {
    final isSelected = _selectedIndex == index;
    return ListTile(
      leading: Icon(icon, color: Colors.white),
      title: Text(
        title,
        style: TextStyle(
          color: Colors.white,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          fontSize: 16,
        ),
      ),
      selected: isSelected,
      selectedTileColor: Colors.white.withOpacity(0.1), // Surbrillance légère
      onTap: () {
        // Change l'onglet et ferme le menu
        setState(() {
          _selectedIndex = index;
        });
        Navigator.pop(context);
      },
    );
  }
}
