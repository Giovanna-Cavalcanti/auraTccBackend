import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Por favor, defina a variável MONGODB_URI no .env');
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });
    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro na conexão com MongoDB:', error.message);
    process.exit(1);
  }
};

mongoose.connection.on('error', (err) => {
  console.error('Erro na conexão MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Desconectado do MongoDB');
});

export default connectDB;