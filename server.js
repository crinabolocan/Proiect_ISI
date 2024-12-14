const express = require('express');
const db = require('./backend/db.js');

const app = express();

// app.get('/test-db', (req, res) => {
//     db.query('SELECT * FROM users', (err, results) => {
//         if (err) {
//             res.status(500).send('Error querying database');
//             console.error(err);
//         } else {
//             res.status(200).json(results);
//         }
//     });
// });

app.listen(3306, () => {
    console.log('Server running on http://localhost:3306');
});
