import 'dart:convert';
import 'package:http/http.dart' as http;

class PaymentService {
  static const String _apiKey = "VOTRE_TOKEN_ICI"; // Le même que React
  static const String _baseUrl = "https://sandbox.paymee.tn/api/v1";

  Future<String?> initiatePayment(double amount, String orderId) async {
    final url = Uri.parse('$_baseUrl/payments');
    
    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_apiKey',
        },
        body: jsonEncode({
          'amount': amount, // Paymee attend le montant direct
          'currency': 'TND',
          'order_id': orderId,
          'return_url': "https://votre-site.com/success", // URL interceptée par Flutter
          'cancel_url': "https://votre-site.com/cancel",
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status'] == true) {
          return data['data']['payment_url']; // L'URL où rediriger l'utilisateur
        }
      }
      print("Erreur Paymee: ${response.body}");
      return null;
    } catch (e) {
      print("Exception Paiement: $e");
      return null;
    }
  }
}
