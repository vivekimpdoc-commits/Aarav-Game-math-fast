const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET top scores
router.get('/scores', (req, res) => {
    const query = `SELECT username, game_type, score, timestamp FROM scores ORDER BY score DESC LIMIT 50`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ scores: rows });
    });
});

// POST a new score
router.post('/score', (req, res) => {
    const { username, game_type, score } = req.body;
    
    if (!username || !game_type || score === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `INSERT INTO scores (username, game_type, score) VALUES (?, ?, ?)`;
    db.run(query, [username, game_type, score], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Score saved successfully', id: this.lastID });
    });
});

module.exports = router;
