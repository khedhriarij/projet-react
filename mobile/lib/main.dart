import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:provider/provider.dart';
import 'firebase_options.dart'; 

// Imports des vues
import 'views/auth/login_view.dart';
import 'views/auth/signup_view.dart'; // Assurez-vous d'importer SignupView
import 'views/dashboard/user_dashboard.dart';
import 'views/admin/admin_main_view.dart'; 

// Imports des ViewModels
import 'viewmodels/auth_viewmodel.dart';
import 'viewmodels/course_viewmodel.dart';
// import 'utils/theme.dart'; // Si vous avez un thème

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthViewModel()),
        ChangeNotifierProvider(create: (_) => CourseViewModel()),
      ],
      child: MaterialApp(
        title: 'LearnUp',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primarySwatch: Colors.blue,
          scaffoldBackgroundColor: Colors.grey[50],
        ),
        
        // --- C'EST ICI QUE VOUS CORRIGEZ L'ERREUR ---
        routes: {
          '/login': (context) => const LoginView(),
          '/signup': (context) => const SignupView(), // Déclaration de la route signup
          '/user_dashboard': (context) => const UserDashboard(),
          '/admin_dashboard': (context) => const AdminMainView(),
        },
        // ---------------------------------------------

        home: const AuthGate(),
      ),
    );
  }
}

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }

        if (snapshot.hasData) {
          final user = snapshot.data!;
          if (user.email == "eyabayoudh@gmail.com") {
            return const AdminMainView(); 
          }
          return const UserDashboard();
        }

        return const LoginView();
      },
    );
  }
}
