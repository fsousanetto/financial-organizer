import express from 'express';
import userRoutes from './userRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import categoriesRoutes from './categoriesRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/categories', categoriesRoutes);
router.use('/auth', authRoutes)

export default router;