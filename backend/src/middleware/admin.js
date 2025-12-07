// backend/middleware/admin.js
const admin = require('../config/firebase');

const adminMiddleware = async (req, res, next) => {
  try {
    // Vérifier que l'utilisateur est connecté
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    
    // Vérifier dans Firebase Auth d'abord
    const userRecord = await admin.auth().getUser(req.user.uid);
    const customClaims = userRecord.customClaims || {};
    
    // Si l'utilisateur a un claim admin
    if (customClaims.admin === true) {
      req.user.isAdmin = true;
      return next();
    }
    
    // Sinon vérifier dans MongoDB
    const User = require('../models/user');
    const userDoc = await User.findOne({ uid: req.user.uid });
    
    if (userDoc && userDoc.role === 'admin') {
      // Mettre à jour Firebase Auth pour les futures requêtes
      await admin.auth().setCustomUserClaims(req.user.uid, { admin: true });
      req.user.isAdmin = true;
      return next();
    }
    
    return res.status(403).json({ 
      error: 'Accès refusé. Rôle administrateur requis.' 
    });
    
  } catch (error) {
    console.error('Erreur admin middleware:', error);
    res.status(500).json({ error: 'Erreur de vérification des permissions' });
  }
};

module.exports = adminMiddleware;