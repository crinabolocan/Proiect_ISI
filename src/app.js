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
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Dacă nu este autentificat, redirecționează la login
    }

    const user = req.session.user;
    res.render('profile', { username: user.username, email: user.email });
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

import router from './routes/index.js';
// const router = require("./routes");
app.use(router);