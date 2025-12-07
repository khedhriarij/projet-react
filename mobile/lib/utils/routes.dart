import 'package:flutter/material.dart';
import '../views/auth/login_view.dart';
import '../views/auth/signup_view.dart';
import '../views/home/home_view.dart';
import '../views/dashboard/dashboard_view.dart';
import '../views/courses/my_courses_view.dart';
import '../views/profile/profile_view.dart';

class RouteNames {
  static const String login = '/login';
  static const String signup = '/signup';
  static const String home = '/home';
  static const String dashboard = '/dashboard';
  static const String myCourses = '/my-courses';
  static const String profile = '/profile';
  static const String certificates = '/certificates';
}

class AppRoutes {
  static final Map<String, WidgetBuilder> routes = {
    RouteNames.login: (context) => const LoginView(),
    RouteNames.signup: (context) => const SignupView(),
    RouteNames.home: (context) => const HomeView(),
    RouteNames.dashboard: (context) => const DashboardView(),
    RouteNames.myCourses: (context) => const MyCoursesView(),
    RouteNames.profile: (context) => const ProfileView(),
    //RouteNames.certificates: (context) => const CertificateView(certificate: null), // Erreur ici : il faut un certificat !
  };
}
