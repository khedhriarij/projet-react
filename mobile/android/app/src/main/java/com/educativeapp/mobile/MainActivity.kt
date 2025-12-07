package com.educativeapp.mobile

import androidx.annotation.NonNull
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugins.GeneratedPluginRegistrant

class MainActivity: FlutterActivity() {
    
    override fun configureFlutterEngine(@NonNull flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        
        // Enregistrement des plugins Flutter
        GeneratedPluginRegistrant.registerWith(flutterEngine)
        
        // Vous pouvez ajouter ici des configurations spécifiques
        // pour les plugins Android natifs si nécessaire
    }
    
    // Méthodes optionnelles pour gérer le cycle de vie
    override fun onResume() {
        super.onResume()
        // Code exécuté quand l'activité reprend
    }
    
    override fun onPause() {
        super.onPause()
        // Code exécuté quand l'activité est mise en pause
    }
}