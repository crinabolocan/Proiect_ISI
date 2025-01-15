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
app.set('views', path.join(__dirname, 'views')); // Setează directorul pentru vizualizări
app.set('view engine', 'ejs'); // Setează EJS ca motor de template-uri



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
            // Redirecționează la pagina de login-failed dacă utilizatorul nu există
            return res.redirect('/login-failed');
        }

        const user = results[0];

        try {
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (isPasswordMatch) {
                // După login reușit, redirecționăm utilizatorul la pagina de profil
                req.session.user = user;
                res.redirect('/profile'); // Redirecționare către pagina de profil
            } else {
                return res.redirect('/login-failed');
            }
        } catch (err) {
            console.error('Error comparing passwords:', err.message);
            res.status(500).send('Internal server error');
        }
    });
});

app.get('/login-failed', (req, res) => {
    res.render('login-failed'); // Redă un fișier EJS cu mesajul dorit
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

    // Obține imaginile favorite și statusul "done" din baza de date
    db.query('SELECT image_url, review, done FROM favorites WHERE user_id = ?', [user.id], (err, results) => {
        if (err) {
            console.error('Error fetching favorite images:', err.message);
            return res.status(500).send('Error fetching favorite images');
        }

        const favoriteImages = results.filter(image => !image.done); // Imagini care nu sunt "done"
        const visitedImages = results.filter(image => image.done); // Imagini care sunt "done"

        res.render('profile', { 
            username: user.username, 
            email: user.email, 
            favoriteImages: favoriteImages,
            visitedImages: visitedImages  // Imagini "done"
        });
    });
});

app.post('/mark-done', (req, res) => {
    const { imageUrl } = req.body;  // URL-ul imaginii
    const userId = req.session.user.id;  // ID-ul utilizatorului

    if (!imageUrl) {
        return res.status(400).send('Image URL is required');
    }

    // Actualizează câmpul "done" pentru imaginea respectivă
    db.query('UPDATE favorites SET done = TRUE WHERE user_id = ? AND image_url = ?', [userId, imageUrl], (err, results) => {
        if (err) {
            console.error('Error marking image as done:', err.message);
            return res.status(500).send('Error marking image as done');
        }
        res.status(200).send('Image marked as done');
    });
});

app.post('/mark-undone', (req, res) => {
    const { imageUrl } = req.body;
    const userId = req.session.user.id;

    if (!imageUrl) {
        return res.status(400).send('Image URL is required');
    }

    // Căutăm imaginea în lista de imagini vizitate
    db.query('SELECT * FROM favorites WHERE user_id = ? AND image_url = ? AND done = TRUE', [userId, imageUrl], (err, results) => {
        if (err) {
            console.error('Error fetching visited images:', err.message);
            return res.status(500).send('Error fetching visited images');
        }

        if (results.length === 0) {
            return res.status(404).send('Image not found in visited list');
        }

        // Mută imaginea înapoi în lista de favorite (schimbă `done` la FALSE)
        db.query('UPDATE favorites SET done = FALSE WHERE user_id = ? AND image_url = ?', [userId, imageUrl], (err, updateResult) => {
            if (err) {
                console.error('Error updating image status:', err.message);
                return res.status(500).send('Error updating image status');
            }

            // Răspunde cu un succes și actualizează pagina
            res.status(200).send('Image moved back to favorites');
        });
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
app.get('/images', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirecționează la login dacă nu este autentificat
    }

    const page = req.query.page || 1;  // Paginarea începe de la 1
    const imagesPerPage = 56; // Numărul de imagini pe care dorești să le afișezi per pagină

    try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: 'IKohYhP-ahZNDJBE_691JbX9hoq8XxGcAOeTLuZ4iYw', // Înlocuiește cu cheia ta API
                count: imagesPerPage  // Numărul total de imagini de obținut
            }
        });

        const images = response.data.map(image => image.urls.small); // Preia doar URL-ul imaginii
        const user = req.session.user;
        console.log("user", user);
        res.render('images', { username: user.username, images: images, page: page + 1 });
    } catch (err) {
        console.error('Error fetching images:', err.message);
        res.status(500).send('Internal server error');
    }
});


app.post('/add-favorite', async (req, res) => {
    const { imageUrl } = req.body;
    const userId = req.session.user.id;

    if (!imageUrl) {
        return res.status(400).send('Image URL is required');
    }

    // Limitele Europei
    const minLatitude = 36.0153;  // Sud
    const maxLatitude = 71.1725; // Nord
    const minLongitude = -9.4983; // Vest
    const maxLongitude = 60.0000; // Est

    // Generare coordonate random în interiorul Europei
    const latitude = (Math.random() * (maxLatitude - minLatitude) + minLatitude).toFixed(8);
    const longitude = (Math.random() * (maxLongitude - minLongitude) + minLongitude).toFixed(8);

    try {
        // Salvează coordonatele în baza de date
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
    } catch (err) {
        console.error('Error processing request:', err.message);
        return res.status(500).send('Error processing request');
    }
});

app.post('/toggle-done', (req, res) => {
    const { imageUrl } = req.body;
    const userId = req.session.user.id;

    if (!imageUrl) {
        return res.status(400).send('Image URL is required');
    }

    // Schimbă valoarea câmpului 'done' (de la TRUE la FALSE sau invers)
    db.query('UPDATE favorites SET done = NOT done WHERE user_id = ? AND image_url = ?', [userId, imageUrl], (err, results) => {
        if (err) {
            console.error('Error toggling done status:', err.message);
            return res.status(500).send('Error toggling done status');
        }
        res.status(200).send('Image status updated');
    });
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
    if (!req.session.user) {
        return res.redirect('/login'); // Dacă nu este autentificat, redirecționează la login
    }

    const user = req.session.user;
    db.query('SELECT id, user_id, image_url, review, latitude, longitude, done FROM favorites WHERE user_id = ?', [user.id], (err, results) => {
        if (err) {
            console.error('Error fetching favorite images:', err.message);
            return res.status(500).send('Error fetching favorite images');
        }
        console.log("Query results:", results);

        const favoriteImages = results.map(row => ({
            id: row.id,            // ID-ul imaginii
            imageUrl: row.image_url, // URL-ul imaginii
            review: row.review, // Descrierea imaginii
            userId: row.user_id,   // ID-ul utilizatorului care a adăugat poza
            long: row.longitude,
            lat: row.latitude, 
            done: row.done // Starea imaginii (done sau nu)
        }));
        console.log("favoriteImages", favoriteImages);
        res.render('map', { username: user.username, email: user.email, favoriteImages: favoriteImages });
    });
});


// Endpoint pentru a adăuga sau actualiza review-ul unei imagini
app.post('/add-review', (req, res) => {
    const { imageUrl, review } = req.body;
    const userId = req.session.user.id;

    if (!imageUrl || !review) {
        return res.status(400).send('Image URL and review are required');
    }

    // Actualizează review-ul în baza de date
    db.query(
        'UPDATE favorites SET review = ? WHERE user_id = ? AND image_url = ?',
        [review, userId, imageUrl],
        (err, results) => {
            if (err) {
                console.error('Error updating review:', err.message);
                return res.status(500).send('Error updating review');
            }
            res.status(200).send('Review added successfully');
        }
    );
});





import router from './routes/index.js';
// const router = require("./routes");
app.use(router);