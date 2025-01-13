import express from 'express';
// const { express } = pkg;
import db from './db.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
const PORT = process.env.PORT || 8080;
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcrypt';
import session from 'express-session';

// Creează __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(express.json())
// app.use(cookieParser())
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000 // Cookie valid timp de 1 zi
    }
}));
app.set('view engine', 'ejs');



// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
// });

app.get('/', (req, res) => {
    if (req.session.user) {
        const user = req.session.user;
        res.render('main', { username: user.username, email: user.email });
    } else {
        res.redirect('/logout'); // Dacă nu este autentificat, redirecționează la login
    }
});


app.get('/users', (req, res) => {
    // Executare query
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('Database query error');
            return;
        }
        res.json(results);
    });
});



app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});


app.post('/register', async (req, res) => {
    console.log('Request body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);  // Verifică tipul de conținut
    const { username, email, password } = req.body;

    console.log('username:', username);
    console.log('email:', email);
    console.log('password:', password);

    if (!username || !email || !password) {
        res.status(400).send('Username, email, and password are required');
        return;
    }

    try {
        // Hasharea parolei pentru securitate
        const hashedPassword = await bcrypt.hash(password, 10);

        // Salvarea utilizatorului în baza de date
        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
                res.status(500).send('Database query error');
                return;
            }
            // După înregistrare reușită, redirecționăm utilizatorul la pagina de profil
            res.redirect('/profile'); // Redirecționare către pagina de profil
        });
    } catch (err) {
        console.error('Error hashing password:', err.message);
        res.status(500).send('Internal server error');
    }
});


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Procesarea autentificării
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).send('Database query error');
            return;
        }

        if (results.length === 0) {
            res.status(401).send('Invalid username or password');
            return;
        }

        const user = results[0];

        try {
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (isPasswordMatch) {
                // După login reușit, redirecționăm utilizatorul la pagina de profil
                req.session.user = user;
                res.redirect('/profile'); // Redirecționare către pagina de profil
            } else {
                res.status(401).send('Invalid username or password');
            }
        } catch (err) {
            console.error('Error comparing passwords:', err.message);
            res.status(500).send('Internal server error');
        }
    });
});

// Pagina de profil
// app.get('/profile', (req, res) => {
//     if (!req.session.user) {
//         return res.redirect('/login'); // Dacă nu este autentificat, redirecționează la login
//     }

//     const user = req.session.user;
//     res.render('profile', { username: user.username, email: user.email });
// });

app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Dacă nu este autentificat, redirecționează la login
    }

    const user = req.session.user;

    // Obține imaginile favorite din baza de date
    db.query('SELECT image_url FROM favorites WHERE user_id = ?', [user.id], (err, results) => {
        if (err) {
            console.error('Error fetching favorite images:', err.message);
            return res.status(500).send('Error fetching favorite images');
        }

        const favoriteImages = results.map(row => row.image_url);  // Extrage URL-urile imaginilor
        res.render('profile', { username: user.username, email: user.email, favoriteImages: favoriteImages });
    });
});


app.get('/logout', (req, res) => {
    // Șterge sesiunea utilizatorului
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err.message);
            res.status(500).send('Unable to logout');
            return;
        }
        res.redirect('/logged-out'); // Redirecționează către pagina cu opțiuni
    });
});

app.get('/logged-out', (req, res) => {
    res.render('logout');
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// Pagina cu imagini
// app.get('/images', (req, res) => {
//     if (!req.session.user) {
//         return res.redirect('/login'); // Redirecționează la login dacă nu este autentificat
//     }

//     const user = req.session.user;
//     res.render('images', { username: user.username });
// });

import axios from 'axios';

// Pagina cu imagini
// Pagina cu imagini
app.get('/images', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirecționează la login dacă nu este autentificat
    }

    const page = req.query.page || 1;  // Paginarea începe de la 1
    const imagesPerPage = 9; // Numărul de imagini pe care dorești să le afișezi per pagină

    try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: 'IKohYhP-ahZNDJBE_691JbX9hoq8XxGcAOeTLuZ4iYw', // Înlocuiește cu cheia ta API
                count: imagesPerPage * page // Numărul total de imagini de obținut
            }
        });

        const images = response.data.map(image => image.urls.small); // Preia doar URL-ul imaginii
        const user = req.session.user;
        console.log("user", user);
        res.render('images', { username: user.username, images: images, page: page });
    } catch (err) {
        console.error('Error fetching images:', err.message);
        res.status(500).send('Internal server error');
    }
});


// Adaugă imagine la favorite
app.post('/add-favorite', (req, res) => {
    const { imageUrl } = req.body;
    const userId = req.session.user.id;

    if (!imageUrl) {
        return res.status(400).send('Image URL is required');
    }

    // Generează locație random
    const latitude = (Math.random() * 180 - 90).toFixed(8); // Între -90 și 90
    const longitude = (Math.random() * 360 - 180).toFixed(8); // Între -180 și 180

    // Salvează imaginea și locația în baza de date
    db.query(
        'INSERT INTO favorites (user_id, image_url, latitude, longitude) VALUES (?, ?, ?, ?)',
        [userId, imageUrl, latitude, longitude],
        (err, results) => {
            if (err) {
                console.error('Error adding favorite image:', err.message);
                return res.status(500).send('Error adding favorite');
            }
            res.status(200).send('Image added to favorites');
        }
    );
});


// Endpoint pentru a elimina imaginea din favorite
app.post('/remove-favorite', (req, res) => {
    const { imageUrl } = req.body;  // URL-ul imaginii trimis din frontend
    const userId = req.session.user.id; // ID-ul utilizatorului din sesiune

    if (!imageUrl) {
        return res.status(400).send('Image URL is required');
    }

    // Șterge imaginea din tabelul favorites
    db.query('DELETE FROM favorites WHERE user_id = ? AND image_url = ?', [userId, imageUrl], (err, results) => {
        if (err) {
            console.error('Error removing favorite image:', err.message);
            return res.status(500).send('Error removing favorite');
        }
        res.status(200).send('Image removed from favorites');
    });
});

app.get('/map', (req, res) => {
    res.render('map');
    // if (req.session.user) {
    //     const user = req.session.user;
    // } else {
    //     res.redirect('/logout'); // Dacă nu este autentificat, redirecționează la login
    // }
});


import router from './routes/index.js';
// const router = require("./routes");
app.use(router);