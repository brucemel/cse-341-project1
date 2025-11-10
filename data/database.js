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
    return callback(new Error('MONGO_URI not configured'));
  }

  console.log('🔄 Iniciando conexión a MongoDB Atlas...');
  console.log('📍 Node version:', process.version);

  // Opciones específicas para Render (Node 18+ en contenedor Linux)
  const options = {
    // NO usar las opciones deprecadas useNewUrlParser y useUnifiedTopology
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    maxPoolSize: 10,
    minPoolSize: 5,
    retryWrites: true,
    retryReads: true,
    w: 'majority',
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
      console.error('   Stack:', err.stack);
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