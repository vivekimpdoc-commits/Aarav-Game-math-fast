const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db/database');

// In-memory active session tokens map (Token -> { id, username })
const activeSessions = new Map();

// Helper to hash password using native crypto module (SHA-256)
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// POST: Sign Up / Register
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    
    if (username.trim().length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }
    if (password.length < 4) {
        return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }

    const trimmedUsername = username.trim();
    const hashedPassword = hashPassword(password);

    // Insert user into database
    const insertQuery = `INSERT INTO users (username, password, level, xp) VALUES (?, ?, 1, 0)`;
    db.run(insertQuery, [trimmedUsername, hashedPassword], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ error: 'Username is already taken' });
            }
            return res.status(500).json({ error: err.message });
        }
        
        const userId = this.lastID;
        const token = crypto.randomBytes(16).toString('hex');
        activeSessions.set(token, { id: userId, username: trimmedUsername });

        res.status(201).json({
            token,
            user: {
                username: trimmedUsername,
                level: 1,
                xp: 0
            }
        });
    });
});

// POST: Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const trimmedUsername = username.trim();
    const hashedPassword = hashPassword(password);

    const query = `SELECT id, username, password, level, xp FROM users WHERE username = ?`;
    db.get(query, [trimmedUsername], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(400).json({ error: 'User does not exist' });
        }
        if (user.password !== hashedPassword) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        const token = crypto.randomBytes(16).toString('hex');
        activeSessions.set(token, { id: user.id, username: user.username });

        res.json({
            token,
            user: {
                username: user.username,
                level: user.level,
                xp: user.xp
            }
        });
    });
});

// POST: Logout
router.post('/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        activeSessions.delete(token);
    }
    res.json({ message: 'Logged out successfully' });
});

// GET: Current logged-in user profile
router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const session = activeSessions.get(token);
    
    if (!session) {
        return res.status(401).json({ error: 'Invalid or expired session token' });
    }

    const query = `SELECT username, level, xp FROM users WHERE id = ?`;
    db.get(query, [session.id], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(404).json({ error: 'User account not found' });
        }
        res.json({ user });
    });
});

// POST: Save/Sync level & XP progress
router.post('/progress', (req, res) => {
    const authHeader = req.headers.authorization;
    const { level, xp } = req.body;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
    }
    if (level === undefined || xp === undefined) {
        return res.status(400).json({ error: 'Level and XP values are required' });
    }

    const token = authHeader.split(' ')[1];
    const session = activeSessions.get(token);
    
    if (!session) {
        return res.status(401).json({ error: 'Invalid or expired session token' });
    }

    const updateQuery = `UPDATE users SET level = ?, xp = ? WHERE id = ?`;
    db.run(updateQuery, [level, xp, session.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Progress updated successfully' });
    });
});

module.exports = router;
