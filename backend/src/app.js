const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const fileRoutes = require('./routes/files');

const app = express();

// ========== ⚡ MIDDLEWARE CRITIQUE POUR NGrok ==========
// AJOUTEZ CES 5 LIGNES IMMÉDIATEMENT APRÈS app = express()
app.use((req, res, next) => {
  res.header('ngrok--skip-browser-warning', 'true');
  console.log(`✅ Header ngrok appliqué pour: ${req.method} ${req.url}`);
  next();
});
// =======================================================

// VOTRE CODE EXISTANT - NE CHANGEZ RIEN CI-DESSOUS
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur de connexion à MongoDB:', err));

// Routes
app.use('/api/files', fileRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend EduPlatform opérationnel',
    timestamp: new Date().toISOString()
  });
});

// ========== ROUTES POUR PAIEMENT (AJOUTEZ CES 3 ROUTES) ==========
app.get('/payment/success', (req, res) => {
  res.json({ 
    success: true,
    message: 'Paiement réussi - Redirection en cours...'
  });
});

app.get('/payment/cancel', (req, res) => {
  res.json({ 
    success: false,
    message: 'Paiement annulé'
  });
});

app.post('/api/payment/webhook', (req, res) => {
  console.log('🔔 Webhook Paymee reçu:', req.body);
  res.status(200).json({ received: true });
});
// =======================================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
  console.log(`🛡️  Middleware ngrok activé - Avertissements désactivés`);
  console.log(`🔗 URL: https://nonalkaloidal-sesquicentennially-kevin.ngrok-free.dev`);
});