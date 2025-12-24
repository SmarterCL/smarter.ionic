// Servidor Node.js para Ionic Angular App
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;
const DIST_FOLDER = path.join(__dirname, 'www');

// Middlewares de seguridad y performance
app.use(helmet());
app.use(compression());
app.use(express.static(DIST_FOLDER));

// Servir el index.html para todas las rutas (para Angular routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_FOLDER, 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Directorio estático: ${DIST_FOLDER}`);
});