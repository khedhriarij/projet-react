import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../services/admin_service.dart';
// Importez la VRAIE vue admin complète
import '../admin/admin_main_view.dart'; 

class AdminDashboard extends StatelessWidget {
  const AdminDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    final adminService = AdminService();

    // Vérification de sécurité rapide
    if (user == null || !adminService.isSuperAdmin(user.email)) {
       return const Scaffold(body: Center(child: Text("Accès non autorisé")));
    }

    // On redirige directement vers la vue complète AdminMainView
    // Ou on affiche un bouton pour y aller
    return Scaffold(
      appBar: AppBar(
        title: const Text("Tableau de Bord"),
        backgroundColor: Colors.redAccent,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
             const Icon(Icons.admin_panel_settings, size: 80, color: Colors.redAccent),
             const SizedBox(height: 20),
             const Text("Bienvenue Admin", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
             const SizedBox(height: 20),
             ElevatedButton.icon(
               onPressed: () {
                 Navigator.push(
                   context, 
                   MaterialPageRoute(builder: (_) => const AdminMainView())
                 );
               },
               icon: const Icon(Icons.dashboard),
               label: const Text("Ouvrir le Dashboard Complet"),
               style: ElevatedButton.styleFrom(
                 padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
               ),
             )
          ],
        ),
      ),
    );
  }
}
