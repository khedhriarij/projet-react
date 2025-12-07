class AppConstants {
  static const String appName = 'LearnUp Mobile';
  static const String appVersion = '1.0.0';
  
  // Firebase Collections
  static const String usersCollection = 'users';
  static const String coursesCollection = 'courses';
  static const String enrollmentsCollection = 'enrollments';
  
  // Storage Keys
  static const String userPrefsKey = 'current_user';
  static const String authTokenKey = 'auth_token';
  
  // API Endpoints
  static const String baseUrl = 'https://your-api-url.com';
  
  // App Settings
  static const double defaultPadding = 16.0;
  static const double defaultBorderRadius = 12.0;
  static const Duration defaultAnimationDuration = Duration(milliseconds: 300);
  
  // Text Constants
  static const String loginSuccess = 'Connexion réussie';
  static const String signupSuccess = 'Inscription réussie';
  static const String logoutSuccess = 'Déconnexion réussie';
  static const String enrollmentSuccess = 'Inscription au cours réussie';
  static const String progressUpdated = 'Progression mise à jour';
  
  // Error Messages
  static const String networkError = 'Erreur de connexion réseau';
  static const String serverError = 'Erreur du serveur';
  static const String unknownError = 'Une erreur est survenue';
}

class AssetPaths {
  static const String logo = 'assets/images/logo.png';
  static const String placeholder = 'assets/images/placeholder.jpg';
  static const String defaultAvatar = 'assets/images/default_avatar.png';
}

class FirebaseConstants {
  static const String projectId = 'plateforme-educative-2020b';
  static const String storageBucket = 'plateforme-educative-2020b.appspot.com';
}