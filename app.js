const express = require('express');
const app = express();
const path = require('path');

// Définir le moteur de vue
app.set('view engine', 'ejs');

// Définir les répertoires statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route pour la page d'accueil
app.get('/', (_req, res) => {
    res.render('index', { title: 'Bougies Sébastien', stylesheet: 'index.css' }); // Ajout de 'stylesheet'
});

// Route pour la bougie "In the Air"
app.get('/in-the-air', (_req, res) => {
    res.render('in-the-air', { title: 'In the Air - Bougies Sébastien', stylesheet: 'in-the-air.css' });
});

// Route pour la bougie "On the Road"
app.get('/on-the-road', (_req, res) => {
    res.render('on-the-road', { title: 'On the Road - Bougies Sébastien', stylesheet: 'on-the-road.css' });
});

// Route pour la bougie "An Afternoon in Ramatuelle"
app.get('/afternoon-ramatuelle', (_req, res) => {
    res.render('afternoon-ramatuelle', { title: 'An Afternoon in Ramatuelle - Bougies Sébastien', stylesheet: 'afternoon-ramatuelle.css' });
});

// Démarrer le serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});

app.get('/galerie', (_req, res) => {
    res.render('galerie', { title: 'Galerie du Savoir-Faire - Bougies Sébastien', stylesheet: 'galerie.css' });
});
