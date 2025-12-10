import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../../services/payment_service.dart';

class PaymentWebView extends StatefulWidget {
  final String paymentUrl;
  final String paymentToken;

  const PaymentWebView({
    super.key,
    required this.paymentUrl,
    required this.paymentToken,
  });

  @override
  State<PaymentWebView> createState() => _PaymentWebViewState();
}

class _PaymentWebViewState extends State<PaymentWebView> {
  late final WebViewController _controller;
  bool _isLoading = true;
  // bool _isInit = false; // Plus besoin

  @override
  void initState() {
    super.initState();
    _initWebView();
  }

  void _initWebView() {
    // Initialisation directe et simple
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            if (mounted) setState(() => _isLoading = true);
          },
          onPageFinished: (String url) {
            if (mounted) setState(() => _isLoading = false);
          },
          onNavigationRequest: (NavigationRequest request) {
            if (request.url.startsWith('https://success.learnup.test')) {
              _verifyAndClose(true);
              return NavigationDecision.prevent;
            }
            if (request.url.startsWith('https://cancel.learnup.test')) {
              Navigator.pop(context, false);
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(Uri.parse(widget.paymentUrl));
  }

  Future<void> _verifyAndClose(bool successUrlReached) async {
    if (successUrlReached) {
      final isValid = await PaymentService().verifyPayment(widget.paymentToken);
      if (mounted) {
        Navigator.pop(context, isValid);
      }
    } else {
      if (mounted) Navigator.pop(context, false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Paiement Sécurisé"),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => Navigator.pop(context, false),
        ),
      ),
      body: Stack(
        children: [
          // Utilisation simple du widget
          WebViewWidget(controller: _controller),
          
          if (_isLoading)
            const Center(child: CircularProgressIndicator()),
        ],
      ),
    );
  }
}
