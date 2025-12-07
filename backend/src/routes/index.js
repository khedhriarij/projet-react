// Ajouter les routes utilisateurs
const userRoutes = require('./userRoutes');

app.use('/api/users', userRoutes);