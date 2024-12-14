import express from 'express';
// const { express } = pkg;
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

import router from './routes/index.js';
// const router = require("./routes");
app.use(router);