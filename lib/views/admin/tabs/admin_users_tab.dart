import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class AdminUsersTab extends StatelessWidget {
  const AdminUsersTab({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance.collection('users').snapshots(),
      builder: (context, snapshot) {
        if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());

        final users = snapshot.data!.docs;

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: users.length,
          itemBuilder: (context, index) {
            final user = users[index].data() as Map<String, dynamic>;
            final role = user['role'] ?? 'student';
            final isActive = user['online'] ?? false; // Exemple de champ

            return Card(
              margin: const EdgeInsets.only(bottom: 10),
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: role == 'admin' ? Colors.red[100] : Colors.blue[100],
                  child: Text(
                    (user['displayName'] ?? "U")[0].toUpperCase(),
                    style: TextStyle(color: role == 'admin' ? Colors.red : Colors.blue, fontWeight: FontWeight.bold),
                  ),
                ),
                title: Text(user['displayName'] ?? "Utilisateur Inconnu", style: const TextStyle(fontWeight: FontWeight.bold)),
                subtitle: Text(user['email'] ?? ""),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: role == 'admin' ? Colors.red : Colors.grey[200],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(role.toUpperCase(), style: TextStyle(fontSize: 10, color: role == 'admin' ? Colors.white : Colors.black)),
                    ),
                    const SizedBox(width: 10),
                    Icon(Icons.circle, size: 10, color: isActive ? Colors.green : Colors.grey),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
