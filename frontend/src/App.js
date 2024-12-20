import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './controllers/firebase-auth-controller';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<h1>Welcome to Home Page</h1>} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
