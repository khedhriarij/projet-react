import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
// Import pour la navigation vers l'admin (assurez-vous que le chemin est bon)
import '../admin/admin_main_view.dart'; 

class ProfileView extends StatelessWidget {
  const ProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    // Récupération de l'utilisateur actuel
    final user = FirebaseAuth.instance.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Mon Profil"),
        backgroundColor: const Color(0xFF6C63FF),
        elevation: 0,
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // --- SECTION HEADER (Avatar + Nom) ---
          Center(
            child: Column(
              children: [
                CircleAvatar(
                  radius: 50,
                  backgroundColor: Colors.purple[100],
                  child: Text(
                    // Affiche la première lettre du nom ou "U" par défaut
                    (user?.displayName != null && user!.displayName!.isNotEmpty)
                        ? user.displayName![0].toUpperCase()
                        : "U",
                    style: const TextStyle(fontSize: 40, color: Colors.purple),
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  user?.displayName ?? "Utilisateur",
                  style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
                Text(
                  user?.email ?? "Email non disponible",
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ],
            ),
          ),
          const SizedBox(height: 30),

          // --- SECTION ADMIN (Visible uniquement pour eyabayoudh@gmail.com) ---
          if (user?.email == "eyabayoudh@gmail.com") ...[
            Card(
              color: Colors.red[50],
              elevation: 2,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
              child: ListTile(
                leading: const Icon(Icons.admin_panel_settings, color: Colors.red, size: 30),
                title: const Text(
                  "ESPACE ADMIN",
                  style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 18),
                ),
                subtitle: const Text("Accéder au tableau de bord administrateur"),
                trailing: const Icon(Icons.arrow_forward_ios, color: Colors.red),
                onTap: () {
                  // Navigation vers le vrai Dashboard Admin (Menu violet)
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const AdminMainView()),
                  );
                },
              ),
            ),
            const SizedBox(height: 20),
          ],

          // --- SECTION MENU UTILISATEUR ---
          _buildProfileItem(Icons.person, "Modifier le profil", () {
            // TODO: Navigation vers page modification
          }),
          _buildProfileItem(Icons.notifications, "Notifications", () {}),
          _buildProfileItem(Icons.security, "Sécurité", () {}),
          _buildProfileItem(Icons.help_outline, "Aide & Support", () {}),
          
          const SizedBox(height: 20),
          
          // --- BOUTON DÉCONNEXION ---
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text(
              "Se déconnecter",
              style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
            ),
            onTap: () async {
              // Déconnexion directe via Firebase
              await FirebaseAuth.instance.signOut();
              // Pas besoin de Navigator.pop, le StreamBuilder dans main.dart gérera le retour au Login
            },
          ),
        ],
      ),
    );
  }

  // Widget utilitaire pour éviter la répétition du code des items
  Widget _buildProfileItem(IconData icon, String title, VoidCallback onTap) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 5, offset: const Offset(0, 2)),
        ],
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color(0xFF6C63FF).withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: const Color(0xFF6C63FF)),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
        trailing: const Icon(Icons.chevron_right, color: Colors.grey),
        onTap: onTap,
      ),
    );
  }
}
