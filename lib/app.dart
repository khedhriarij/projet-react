import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// ViewModels
import 'viewmodels/auth_viewmodel.dart';
import 'viewmodels/course_viewmodel.dart';
import 'viewmodels/user_viewmodel.dart';

// Vues
import 'views/auth/login_view.dart';
import 'views/auth/signup_view.dart';
import 'views/home/home_view.dart';
import 'views/dashboard/dashboard_view.dart';
import 'views/courses/my_courses_view.dart';
import 'views/courses/course_detail_view.dart';

class LearnUpApp extends StatelessWidget {
  const LearnUpApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthViewModel()),
        ChangeNotifierProvider(create: (_) => CourseViewModel()),
        ChangeNotifierProvider(create: (_) => UserViewModel()),
      ],
      child: MaterialApp(
        title: 'Plateforme Éducative',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          primaryColor: const Color(0xFF6C63FF),
          scaffoldBackgroundColor: const Color(0xFFF5F7FA),
          colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF6C63FF)),
          fontFamily: 'Poppins',
          appBarTheme: const AppBarTheme(
            backgroundColor: Color(0xFF6C63FF),
            foregroundColor: Colors.white,
            elevation: 0,
            centerTitle: true,
          ),
        ),
        onGenerateRoute: (settings) {
          // Gestion spéciale pour passer des arguments
          if (settings.name == '/course-detail') {
            // On récupère l'argument. Si c'est déjà une Map, c'est bon.
            // Si c'est un CourseModel, il faudra adapter CourseDetailView ou convertir ici.
            
            // OPTION 1 (Recommandée pour l'instant vu vos derniers codes) :
            // On s'attend à recevoir une Map depuis la navigation
            final course = settings.arguments as Map<String, dynamic>;
            return MaterialPageRoute(builder: (_) => CourseDetailView(course: course));
          }
          return null;
        },
        routes: {
          '/login': (context) => const LoginView(),
          '/signup': (context) => const SignupView(),
          '/home': (context) => const HomeView(),
          '/dashboard': (context) => const DashboardView(),
          '/my-courses': (context) => const MyCoursesView(),
        },
      ),
    );
  }
}
