const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado a MongoDB Atlas')).catch(err => console.error('Error MongoDB:', err));

// Esquema y modelo
const calorieSchema = new mongoose.Schema({
  date: String,
  meal: String,
  calories: Number,
});
const Calorie = mongoose.model('Calorie', calorieSchema);

// Rutas API
app.post('/api/calories', async (req, res) => {
  try {
    const { date, meal, calories } = req.body;
    if (!date || !meal || !calories) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    const calorie = new Calorie({ date, meal, calories });
    await calorie.save();
    res.status(201).json({ message: 'Calorías registradas' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar' });
  }
});

app.get('/api/calories', async (req, res) => {
  try {
    const calories = await Calorie.find();
    res.json(calories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));