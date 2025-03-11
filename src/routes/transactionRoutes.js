import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import * as R from '../controllers/transactionsController.js';

const router = express.Router();

router.post('/', authMiddleware, R.createTransaction);
router.get('/', authMiddleware, R.getTransactions);
router.put('/:id', authMiddleware, R.updateTransactions);
router.delete('/:id', authMiddleware, R.deleteTransaction);

export default router;