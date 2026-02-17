const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let pedidosRecibidos = [];

app.post('/api/pedidos', (req, res) => {
  pedidosRecibidos.push(req.body);
  console.log(`📥 Recibido: ${req.body.cliente}`);
  res.status(200).json({ status: 'ok' });
});

// ESTO ES LO QUE NECESITA LA LAPTOP PARA MOSTRAR LA LISTA
app.get('/api/pedidos', (req, res) => {
  res.json(pedidosRecibidos);
});

app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));