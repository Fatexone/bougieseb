const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');

require('dotenv').config(); // To load environment variables from .env file



const app = express();

// Dummy users (replace this with your actual user database or model)
const users = [
    {
        id: 1,
        username: 'admin',
        password: '$2a$10$.9ih1NCjd.RRUQK77OCrsOIkgeVmpTRPp/PMRIWWo59OoFpr1PAz.' // Hashed Fatexone'
    }
];

// Passport.js setup
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
    }
    bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect password.' });
        }
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Middleware to parse JSON

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallbackSecret', // Use secret from .env
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// MongoDB connection without deprecated options
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Event Schema for tracking
const eventSchema = new mongoose.Schema({
    eventType: {
        type: String,
        enum: ['pageView', 'buyClick'], // Only allow specific event types
        required: true
    },
    productId: String,
    timestamp: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Route for login page
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login', stylesheet: 'login.css', message: req.flash('error') });
});

// Route to handle login submissions
app.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true
}));

// Route to handle logout
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});





app.get('/admin', isAuthenticated, async (req, res) => {
    try {
        // Count the buy clicks for each product
        const clickStats = await Event.aggregate([
            { $match: { eventType: 'buyClick' } },
            { $group: { _id: "$productId", count: { $sum: 1 } } }
        ]);

        // Count the total number of page views
        const pageViewCount = await Event.countDocuments({ eventType: 'pageView' });

        // Mapping product names
        const products = {
            product1: 'In the Air',
            product2: 'On the Road',
            product3: 'Afternoon in Ramatuelle'
        };

        // Map the product ID to its name for better display
        const clicks = clickStats.map(stat => ({
            productName: products[stat._id] || 'Unknown Product',
            count: stat.count
        }));

        // Render the admin page with the pageViewCount and clicks data
        res.render('admin', { clicks: clicks, pageViewCount: pageViewCount, title: 'Admin Dashboard', stylesheet: 'admin.css' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    }
});







// Track page views
app.post('/track-page-view', async (req, res) => {
    try {
        const event = new Event({
            eventType: 'pageView'
        });
        await event.save();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Track buy button clicks
app.post('/track-buy-click', async (req, res) => {
    const { productId } = req.body;

    try {
        const event = new Event({
            eventType: 'buyClick',
            productId: productId
        });

        await event.save();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error tracking buy click');
    }
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files setup
app.use(express.static(path.join(__dirname, 'public')));

// Routes for pages
app.get('/', (_req, res) => {
    res.render('index', { title: 'Bougies Sébastien', stylesheet: 'index.css' });
});

app.get('/in-the-air', (req, res, next) => {
    try {
        res.render('in-the-air', { title: 'In the Air - Bougies Sébastien', stylesheet: 'in-the-air.css' });
    } catch (err) {
        next(err);
    }
});

app.get('/on-the-road', (_req, res) => {
    res.render('on-the-road', { title: 'On the Road - Bougies Sébastien', stylesheet: 'on-the-road.css' });
});

app.get('/afternoon-ramatuelle', (_req, res) => {
    res.render('afternoon-ramatuelle', { title: 'An Afternoon in Ramatuelle - Bougies Sébastien', stylesheet: 'afternoon-ramatuelle.css' });
});

app.get('/galerie', (_req, res) => {
    res.render('galerie', { title: 'Galerie du Savoir-Faire - Bougies Sébastien', stylesheet: 'galerie.css' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
