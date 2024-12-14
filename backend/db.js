const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost', // sau IP-ul serverului MySQL
    user: 'root',      // utilizatorul configurat în MySQL
    password: 'crina', // parola utilizatorului
    database: 'Proiect_ISI' // baza de date creată
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as ID ' + connection.threadId);
});

module.exports = connection;
