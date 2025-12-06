// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const admin = require('../config/firebase');
const User = require('../models/user');

// Synchroniser utilisateur Firebase -> MongoDB
router.post('/sync', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;
    
    let user = await User.findOne({ uid });
    
    if (!user) {
      user = new User({
        uid,
        email,
        displayName,
        photoURL,
        lastLogin: new Date()
      });
      await user.save();
      console.log('👤 Nouvel utilisateur créé:', uid);
    } else {
      user.lastLogin = new Date();
      await user.save();
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Récupérer profil utilisateur
router.get('/profile/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid })
      .populate('enrolledCourses.courseId', 'title thumbnailUrl')
      .populate('purchases.courseId', 'title price');
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;