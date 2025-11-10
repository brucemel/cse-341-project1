// ❌ NO cargar dotenv aquí - ya se carga en server.js
const { MongoClient } = require('mongodb');

let database;

const initDb = (callback) => {
  if (database) {
    console.log('✅ DB ya inicializada');
    return callback(null, database);
  }

  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    console.error('❌ MONGO_URI NO ESTÁ CONFIGURADO');
    console.error('💡 Asegúrate de que el archivo .env existe con MONGO_URI');
    return callback(new Error('MONGO_URI not configured'));
  }

  console.log('🔄 Iniciando conexión a MongoDB Atlas...');
  console.log('📍 Conectando a:', mongoUri.split('@')[1]?.split('/')[0] || '[hidden]');

  const options = {
    tls: true,
    tlsAllowInvalidCertificates: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 15000,
  };

  MongoClient.connect(mongoUri, options)
    .then((client) => {
      database = client;
      console.log('✅ ¡CONEXIÓN A MONGODB EXITOSA!');
      callback(null, database);
    })
    .catch((err) => {
      console.error('❌ ERROR AL CONECTAR A MONGODB:');
      console.error('   Mensaje:', err.message);
      console.error('🔧 Verifica:');
      console.error('   1. MONGO_URI en .env (local) o Render Environment (producción)');
      console.error('   2. IP 0.0.0.0/0 en MongoDB Atlas Network Access');
      console.error('   3. Usuario/password correctos');
      callback(err);
    });
};

const getDatabase = () => {
  if (!database) {
    throw new Error('Database not initialized');
  }
  return database;
};

module.exports = { initDb, getDatabase };