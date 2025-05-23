const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { isUserLive } = require('./livechecker');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// Ruta raíz para confirmar que la API está funcionando
app.get('/', (req, res) => {
  res.send('¡API de cocoapi funcionando correctamente!');
});

// Ruta para verificar un solo usuario
app.get('/api/live/:username', async (req, res) => {
  const { username } = req.params;
  const result = await isUserLive(username);
  res.json(result);
});

// Ruta para verificar todos los usuarios del JSON
app.get('/api/live', async (req, res) => {
  let userList = [];
  try {
    const data = fs.readFileSync('./users.json', 'utf-8');
    userList = JSON.parse(data);
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo leer el archivo users.json' });
  }

  const results = [];
  for (const user of userList) {
    const result = await isUserLive(user);
    if (result.isLive) results.push(result.username);
  }

  res.json({ liveUsers: results });
});

app.listen(PORT, () => {
  console.log(`🟢 API corriendo en http://localhost:${PORT}`);
});
