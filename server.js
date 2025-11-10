// Cargar variables de entorno (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongodb = require('./data/database');
const app = express();

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Logs de configuración
console.log('🔍 Verificando configuración:');
console.log('   PORT:', port);
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('   MONGO_URI configurado:', !!process.env.MONGO_URI);

// PASO 1: Inicializar la base de datos PRIMERO
mongodb.initDb((err) => {
  if (err) {
    console.error('❌ Error al inicializar base de datos:', err.message);
    console.error('⚠️  El servidor iniciará sin base de datos');
    
    // Rutas de fallback
    app.get('*', (req, res) => {
      res.status(503).json({ 
        error: 'Database unavailable',
        message: 'Unable to connect to MongoDB'
      });
    });
  } else {
    console.log('✅ Base de datos inicializada correctamente');
    
    // PASO 2: Registrar las rutas DESPUÉS de que la DB esté lista
    app.use('/', require('./routes'));
    console.log('✅ Rutas registradas exitosamente');
  }
  
  // PASO 3: Iniciar el servidor (UNA SOLA VEZ)
  app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en puerto ${port}`);
  });
});