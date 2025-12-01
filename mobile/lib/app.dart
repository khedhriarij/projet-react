import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'view_models/auth_viewmodel.dart';
import 'views/auth/login_view.dart';
import 'views/catalog/catalog_view.dart';

class App extends StatefulWidget {
  @override
  _AppState createState() => _AppState();
}

class _AppState extends State<App> {
  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    await Provider.of<AuthViewModel>(context, listen: false).initialize();
  }

  @override
  Widget build(BuildContext context) {
    final authViewModel = Provider.of<AuthViewModel>(context);

    if (authViewModel.loading) {
      return Scaffold(
        backgroundColor: Colors.white,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(color: Colors.orange),
              SizedBox(height: 20),
              Text(
                'Chargement...',
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 16,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return authViewModel.isAuthenticated ? CatalogView() : LoginView();
  }
}