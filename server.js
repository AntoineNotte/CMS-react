// Importez les dépendances nécessaires
const express = require('express');
const userRoutes = require('./routes/userRoutes');

// Créez une instance d'Express
const app = express();
const port = process.env.PORT || 3001; // Vous pouvez définir le port de votre choix

// Utilisez les routes dans votre application Express
app.use('/api', userRoutes);

// Définissez une route de test
app.get('/', (req, res) => {
  res.send('Bienvenue sur votre serveur Express!');
});

// Démarrez le serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
