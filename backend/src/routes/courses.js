// backend/routes/courses.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const premiumMiddleware = require('../middleware/premium');
const Course = require('models/Course');
const Lesson = require('models/Lesson');

// Liste des cours (public)
router.get('/', async (req, res) => {
  try {
    const { category, level, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;
    
    let query = { status: 'published' };
    
    // Filtres
    if (category) query.category = category;
    if (level) query.level = level;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Recherche texte
    if (search) {
      query.$text = { $search: search };
    }
    
    const skip = (page - 1) * limit;
    
    const courses = await Course.find(query)
      .populate('instructor', 'displayName photoURL')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Course.countDocuments(query);
    
    res.json({
      success: true,
      data: courses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Détails d'un cours
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'displayName photoURL bio')
      .populate({
        path: 'lessons',
        match: { status: 'published' },
        select: 'title description duration isPremium order'
      });
    
    if (!course || course.status !== 'published') {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }
    
    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Contenu d'un cours (protégé)
router.get('/:id/content', authMiddleware, premiumMiddleware, async (req, res) => {
  try {
    const lessons = await Lesson.find({ 
      courseId: req.params.id,
      status: 'published'
    }).sort({ order: 1 });
    
    res.json({
      success: true,
      data: lessons
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;