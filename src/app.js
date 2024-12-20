import express from 'express';
// const { express } = pkg;
import db from './db.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
const PORT = process.env.PORT || 8080;
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcrypt';


// Creează __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(express.json())
// app.use(cookieParser())
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hello World');
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
            res.send('Registration successful!');
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
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
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
                res.send('Login successful!');
            } else {
                res.status(401).send('Invalid username or password');
            }
        } catch (err) {
            console.error('Error comparing passwords:', err.message);
            res.status(500).send('Internal server error');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

import router from './routes/index.js';
// const router = require("./routes");
app.use(router);