import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import resourceRouter from './controllers/resourceController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8002;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Resource Booking Service Running on Port 8002' });
});

app.use('/', resourceRouter);

// Unknown routes
app.use((req, res) => {
    res.status(404).json({ code: 404, message: 'Route not found' });
});

// Start only after DB connects
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Resource Service running on http://localhost:${PORT}`);
    });
});
