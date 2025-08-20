import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import pacienteRoutes from './routes/pacienteRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão com DB
await connectDB();

// Rotas
app.use('/api/pacientes', pacienteRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Erro interno no servidor' 
  });
});

export default app;