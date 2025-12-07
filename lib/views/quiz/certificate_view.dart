import 'package:flutter/material.dart';
import '../../models/certificate_model.dart';

class CertificateView extends StatelessWidget {
  final CertificateModel certificate;

  const CertificateView({super.key, required this.certificate});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text("Votre Certificat"),
        backgroundColor: const Color(0xFF6C63FF),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const SizedBox(height: 20),
            const Icon(Icons.verified_user, size: 80, color: Color(0xFF6C63FF)),
            const SizedBox(height: 20),
            const Text(
              "Félicitations !",
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.black87),
            ),
            const SizedBox(height: 10),
            const Text(
              "Vous avez complété le cours avec succès.",
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 30),
            
            // Le Certificat visuel
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(30),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE0E0E0), width: 1),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 10)),
                ],
              ),
              child: Column(
                children: [
                  // Logo ou Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.school, color: Color(0xFF6C63FF), size: 30),
                      const SizedBox(width: 10),
                      Text("LEARN UP", style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.grey[800], letterSpacing: 2)),
                    ],
                  ),
                  const SizedBox(height: 30),
                  const Text("CERTIFICAT DE RÉUSSITE", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF6C63FF))),
                  const SizedBox(height: 20),
                  const Text("Ce certificat est décerné à", style: TextStyle(fontSize: 14, color: Colors.grey)),
                  const SizedBox(height: 10),
                  Text(
                    certificate.studentName.isNotEmpty ? certificate.studentName : "Étudiant", 
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, fontFamily: 'serif'),
                  ),
                  const SizedBox(height: 20),
                  const Divider(color: Colors.grey, thickness: 0.5, indent: 40, endIndent: 40),
                  const SizedBox(height: 20),
                  const Text("Pour avoir complété le cours", style: TextStyle(fontSize: 14, color: Colors.grey)),
                  const SizedBox(height: 10),
                  Text(
                    certificate.courseTitle,
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 40),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text("Date", style: TextStyle(fontSize: 12, color: Colors.grey[600])),
                          Text("${certificate.issueDate.day}/${certificate.issueDate.month}/${certificate.issueDate.year}", style: const TextStyle(fontWeight: FontWeight.bold)),
                        ],
                      ),
                      // Fausse signature
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          const Text("Signature", style: TextStyle(fontSize: 12, color: Colors.grey)),
                          const SizedBox(height: 5),
                          Image.network("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png", height: 30, color: Colors.black),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  // TODO: Implémenter le partage ou téléchargement PDF
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Téléchargement PDF en cours...")));
                },
                icon: const Icon(Icons.download),
                label: const Text("Télécharger en PDF"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6C63FF),
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
