import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import pacienteRoutes from './routes/pacienteRoutes.js';
import profissionalRoutes from './routes/profissionalRoutes.js';

import swaggerUi from "swagger-ui-express";
import fs from "fs";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão com DB
await connectDB();

// Lê o JSON
const swaggerDocument = JSON.parse(fs.readFileSync("./docs/swagger.json", "utf-8"));

// Rota do Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/profissionais', profissionalRoutes);

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