package com.educativeapp.mobile

import android.app.Application
import com.google.firebase.FirebaseApp

class Application : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Initialiser Firebase
        try {
            FirebaseApp.initializeApp(this)
            println("✅ Firebase initialisé avec succès")
        } catch (e: Exception) {
            println("❌ Erreur lors de l'initialisation de Firebase: ${e.message}")
        }
    }
}