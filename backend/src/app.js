// backend/app.js - Version finale
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import des routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');
const paymentRoutes = require('./routes/payment');
const quizRoutes = require('./routes/quiz');
const progressRoutes = require('./routes/progress');
const fileRoutes = require('./routes/files');

const app = express();

// ========== CONFIGURATION DE SÉCURITÉ ==========
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware ngrok
app.use((req, res, next) => {
  res.header('ngrok-skip-browser-warning', 'true');
  next();
});

// ========== CONNEXION DATABASE ==========
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10
})
.then(() => console.log('✅ MongoDB connecté'))
.catch(err => {
  console.error('❌ Erreur MongoDB:', err);
  process.exit(1);
});

// ========== ROUTES API ==========
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/files', fileRoutes);

// ========== ROUTES DE SANTÉ ==========
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ========== ROUTES PAIEMENT ==========
app.get('/payment/success', (req, res) => {
  res.json({ 
    success: true,
    message: 'Paiement réussi ! Redirection...'
  });
});

app.get('/payment/cancel', (req, res) => {
  res.json({ 
    success: false,
    message: 'Paiement annulé'
  });
});

// ========== GESTION DES ERREURS ==========
app.use((err, req, res, next) => {
  console.error('🔥 Erreur:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : err.message
  });
});

// ========== DÉMARRAGE SERVEUR ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Serveur démarré sur le port ${PORT}`);
  console.log(` Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(` URL: ${process.env.BACKEND_URL || `http://localhost:${PORT}`}`);
});