import 'package:flutter/material.dart';

class AdminOverviewTab extends StatelessWidget {
  const AdminOverviewTab({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text("Bienvenue, Administrateur 👍", style: TextStyle(fontSize: 16, color: Colors.grey)),
        const SizedBox(height: 20),
        
        // Cartes de statistiques (Revenus, Étudiants, Cours)
        Row(
          children: [
            Expanded(child: _buildStatCard("Revenus Totaux", "125,000 TND", Icons.monetization_on, Colors.green)),
            const SizedBox(width: 10),
            Expanded(child: _buildStatCard("Étudiants Actifs", "1560", Icons.people, Colors.blue)),
          ],
        ),
        const SizedBox(height: 10),
        _buildStatCard("Cours Disponibles", "6", Icons.book, Colors.orange, fullWidth: true),

        const SizedBox(height: 30),
        const Text("Cours les Plus Populaires", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        // Simulation d'un cours populaire
        Card(
          elevation: 2,
          child: ListTile(
            leading: Container(
              width: 50, height: 50,
              color: Colors.blue,
              child: const Center(child: Text("#1", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
            ),
            title: const Text("React Avancé"),
            subtitle: const Text("Ahmed Ben Ali"),
            trailing: const Text("1240 étudiants", style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        )
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color, {bool fullWidth = false}) {
    return Container(
      padding: const EdgeInsets.all(20),
      height: 120,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 10, spreadRadius: 2)],
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, color: color, size: 30),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
                child: Text("+12%", style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold)),
              )
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
              Text(title, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
            ],
          )
        ],
      ),
    );
  }
}
