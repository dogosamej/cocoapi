const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { checkLiveStatus } = require('./livechecker');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// Ruta para verificar un solo usuario
app.get('/api/live/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const isLive = await checkLiveStatus(username);
    res.json({ username, isLive });
  } catch (error) {
    res.status(500).json({ error: `Error al verificar a ${username}` });
  }
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
    try {
      const isLive = await checkLiveStatus(user);
      if (isLive) results.push(user);
    } catch (error) {
      console.error(`❌ Error al verificar a ${user}: ${error.message}`);
    }
  }

  res.json({ liveUsers: results });
});

app.listen(PORT, () => {
  console.log(`🟢 API corriendo en http://localhost:${PORT}`);
});
