import app from './app.js';
import 'dotenv/config';
// import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "./docs/swagger.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log("Documentação disponível em http://localhost:3000/docs");
});