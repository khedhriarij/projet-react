import 'dart:convert';
import 'package:http/http.dart' as http;
// import 'package:flutter_secure_storage/flutter_secure_storage.dart'; // Commenté car pas utilisé pour l'instant

class PaymentService {
  // Clé API Paymee (A METTRE DANS UN FICHIER .ENV EN PROD)
  final String _apiKey = "a19c7d126f1216663fc01416fb21c131c41486b4"; // Remplace par ta vraie clé API !
  final bool _isProduction = false; // Mettre true pour la prod

  String get _baseUrl => _isProduction
      ? 'https://paymee.tn/api/v2/payments'
      : 'https://sandbox.paymee.tn/api/v2/payments';

  // final _storage = const FlutterSecureStorage(); // Supprimé car inutile pour l'instant

  // Création du paiement
  Future<Map<String, dynamic>?> createPayment({
    required double amount,
    required String courseTitle,
    required String orderId,
    required String firstName,
    required String lastName,
    required String email,
    required String phoneNumber,
  }) async {
    final url = Uri.parse('$_baseUrl/create');

    final body = {
      "amount": amount,
      "note": "Achat cours: $courseTitle",
      "first_name": firstName,
      "last_name": lastName,
      "email": email,
      "phone": phoneNumber,
      "return_url": "https://success.learnup.test",
      "cancel_url": "https://cancel.learnup.test",
      "webhook_url": "https://example.com/webhook",
      "order_id": orderId,
    };

    try {
      print('🚀 Envoi paiement Paymee: $body');
      
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token $_apiKey',
        },
        body: jsonEncode(body),
      );

      print('📥 Réponse Paymee (${response.statusCode}): ${response.body}');

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == true) {
          return {
            'token': jsonResponse['data']['token'],
            'payment_url': jsonResponse['data']['payment_url'],
          };
        }
      }
      return null;
    } catch (e) {
      print('❌ Erreur PaymentService: $e');
      return null;
    }
  }

  // Vérification du paiement
  Future<bool> verifyPayment(String token) async {
    final url = Uri.parse('$_baseUrl/$token');

    try {
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Token $_apiKey',
        },
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        // Paymee renvoie status: true et data.payment_status: true ou 'completed'
        if (jsonResponse['status'] == true && 
           (jsonResponse['data']['payment_status'] == true || jsonResponse['data']['payment_status'] == 'completed')) {
          return true;
        }
      }
      return false;
    } catch (e) {
      print('❌ Erreur Vérification: $e');
      return false;
    }
  }
}
