import express from 'express';
import cors from 'cors';
import pool from './db.js';
import dotenv from 'dotenv';
import path from 'path';
import url from 'url';

dotenv.config();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Middleware temporal para loguear peticiones a /uploads
app.use('/uploads', (req, res, next) => {
  console.log(`Petición a /uploads: ${req.method} ${req.originalUrl}`);
  next();
});

// Serve static files from uploads folder using __dirname
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

// Use sample routes for CRUD 
import sampleRoutes from './routes/sampleRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import asesorRoutes from './routes/asesorRoutes.js';

app.use('/api/sample', sampleRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/asesor', asesorRoutes);

// Example route to test PostgreSQL connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ currentTime: result.rows[0].now });
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
