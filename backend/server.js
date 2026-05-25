const express = require('express');
const cors = require('cors');
const db = require('./db/database');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/game', gameRoutes);

app.get('/', (req, res) => {
    res.send('Math Game Backend API is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
