import express from 'express';
// const express = require('express');
const router = express.Router();
import verifyToken from '../middleware/index.js';
import PostsController from '../controllers/posts-controller.js';

import firebaseAuthController from '../controllers/firebase-auth-controller.js';
// const firebaseAuthController = require('../controllers/firebase-auth-controller');

router.post('/api/register', firebaseAuthController.registerUser);
router.post('/api/login', firebaseAuthController.loginUser);
router.post('/api/logout', firebaseAuthController.logoutUser);
router.post('/api/reset-password', firebaseAuthController.resetPassword);
router.get('/api/posts', verifyToken, PostsController.getPosts);

// module.exports = router;

export default router;