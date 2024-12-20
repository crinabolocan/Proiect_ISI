import mysql from 'mysql';

// Configurare conexiune
const connection = mysql.createConnection({
    host: '127.0.0.1',      // Adresa serverului (localhost sau IP-ul tău)
    user: 'root',           // Numele utilizatorului MySQL
    password: 'crina', // Parola utilizatorului
    database: 'proiect_isi', // Numele bazei de date
    port: 3306              // Portul MySQL (implicit este 3306)
});

// Testare conexiune
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL!');
});

export default connection;
