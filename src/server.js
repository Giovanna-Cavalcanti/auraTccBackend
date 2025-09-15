import app from './app.js';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log("Documentação disponível em http://localhost:3000/docs");
});