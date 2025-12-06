// backend/middleware/auth.js
const admin = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Accès non autorisé' });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'student'
    };
    next();
  } catch (error) {
    console.error('Erreur auth:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = authMiddleware;