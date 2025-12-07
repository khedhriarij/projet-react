// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const User = require('../models/user');
const admin = require('../config/firebase');

// Récupérer tous les utilisateurs (Admin seulement)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .select('-__v')
      .populate('enrolledCourses.courseId', 'title')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

// Récupérer un utilisateur par ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ $or: [{ _id: req.params.id }, { uid: req.params.id }] })
      .populate('enrolledCourses.courseId', 'title thumbnailUrl')
      .populate('purchases.courseId', 'title');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

// Mettre à jour un utilisateur
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { role, displayName, photoURL } = req.body;
    
    const updateData = {};
    if (role) updateData.role = role;
    if (displayName) updateData.displayName = displayName;
    if (photoURL) updateData.photoURL = photoURL;
    
    const user = await User.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { uid: req.params.id }] },
      updateData,
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }
    
    // Mettre à jour aussi dans Firebase Auth si displayName ou photoURL
    if (displayName || photoURL) {
      try {
        await admin.auth().updateUser(user.uid, {
          displayName: displayName || undefined,
          photoURL: photoURL || undefined
        });
      } catch (firebaseError) {
        console.error('Erreur lors de la mise à jour Firebase:', firebaseError);
      }
    }
    
    res.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: user
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

// Supprimer un utilisateur
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ $or: [{ _id: req.params.id }, { uid: req.params.id }] });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }
    
    // Supprimer de Firebase Auth
    try {
      await admin.auth().deleteUser(user.uid);
    } catch (firebaseError) {
      console.error('Erreur lors de la suppression Firebase:', firebaseError);
    }
    
    // Supprimer de MongoDB
    await User.deleteOne({ _id: user._id });
    
    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

// Récupérer les statistiques des utilisateurs
router.get('/stats/dashboard', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const instructors = await User.countDocuments({ role: 'instructor' });
    const admins = await User.countDocuments({ role: 'admin' });
    
    // Utilisateurs créés ce mois-ci
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlySignups = await User.countDocuments({ createdAt: { $gte: startOfMonth } });
    
    // Conversion par rôle
    const roleDistribution = {
      student: Math.round((students / totalUsers) * 100) || 0,
      instructor: Math.round((instructors / totalUsers) * 100) || 0,
      admin: Math.round((admins / totalUsers) * 100) || 0
    };
    
    res.json({
      success: true,
      data: {
        totalUsers,
        students,
        instructors,
        admins,
        monthlySignups,
        roleDistribution
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

module.exports = router;