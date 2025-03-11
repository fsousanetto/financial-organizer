import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import transactionRotes from './routes/transactionRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 3333

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRotes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
    res.send('Organizer API running!')
});

app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT} 🚀`));