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

    const query = `SELECT username, level, xp, email FROM users WHERE id = ?`;
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

// POST: Send OTP to Email
router.post('/send-otp', (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'A valid email address is required' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    const insertQuery = `INSERT INTO otps (email, code, expires_at) VALUES (?, ?, ?)`;
    db.run(insertQuery, [email.trim().toLowerCase(), code, expiresAt], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Log the OTP to the console so developers/users can see it easily in terminal
        console.log('\n=========================================');
        console.log(`[EMAIL OTP] Code for ${email}: ${code}`);
        console.log('=========================================\n');

        res.json({ message: 'OTP sent successfully', demoOtp: code });
    });
});

// POST: Verify OTP and Login/Register
router.post('/verify-otp', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
        return res.status(400).json({ error: 'Email and OTP code are required' });
    }

    const cleanedEmail = email.trim().toLowerCase();

    const selectOtpQuery = `SELECT id, code, expires_at, verified FROM otps WHERE email = ? AND code = ? AND verified = 0 ORDER BY id DESC LIMIT 1`;
    db.get(selectOtpQuery, [cleanedEmail, code.trim()], (err, otpRow) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!otpRow) {
            return res.status(400).json({ error: 'Invalid OTP code' });
        }

        const now = new Date();
        const expiresAt = new Date(otpRow.expires_at);
        if (expiresAt < now) {
            return res.status(400).json({ error: 'OTP code has expired' });
        }

        // Mark OTP as verified
        db.run(`UPDATE otps SET verified = 1 WHERE id = ?`, [otpRow.id], (updateErr) => {
            if (updateErr) {
                return res.status(500).json({ error: updateErr.message });
            }

            // Check if user already exists with this email
            db.get(`SELECT id, username, level, xp, email FROM users WHERE email = ?`, [cleanedEmail], (userErr, userRow) => {
                if (userErr) {
                    return res.status(500).json({ error: userErr.message });
                }

                if (userRow) {
                    // Existing User: Log in
                    const token = crypto.randomBytes(16).toString('hex');
                    activeSessions.set(token, { id: userRow.id, username: userRow.username });

                    return res.json({
                        token,
                        user: {
                            username: userRow.username,
                            level: userRow.level,
                            xp: userRow.xp,
                            email: userRow.email
                        }
                    });
                } else {
                    // New User: Generate a unique username based on the email prefix
                    const prefix = cleanedEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
                    const baseUsername = prefix || 'mathplayer';

                    // Ensure unique username
                    db.all(`SELECT username FROM users WHERE username LIKE ?`, [`${baseUsername}%`], (likesErr, rows) => {
                        if (likesErr) {
                            return res.status(500).json({ error: likesErr.message });
                        }

                        let finalUsername = baseUsername;
                        const existingNames = rows.map(r => r.username.toLowerCase());
                        
                        if (existingNames.includes(finalUsername.toLowerCase())) {
                            let suffix = 1;
                            while (existingNames.includes(`${finalUsername}${suffix}`.toLowerCase())) {
                                suffix++;
                            }
                            finalUsername = `${finalUsername}${suffix}`;
                        }

                        // Create the new user
                        const insertUserQuery = `INSERT INTO users (username, email, level, xp) VALUES (?, ?, 1, 0)`;
                        db.run(insertUserQuery, [finalUsername, cleanedEmail], function(insertUserErr) {
                            if (insertUserErr) {
                                return res.status(500).json({ error: insertUserErr.message });
                            }

                            const userId = this.lastID;
                            const token = crypto.randomBytes(16).toString('hex');
                            activeSessions.set(token, { id: userId, username: finalUsername });

                            res.status(201).json({
                                token,
                                user: {
                                    username: finalUsername,
                                    level: 1,
                                    xp: 0,
                                    email: cleanedEmail
                                }
                            });
                        });
                    });
                }
            });
        });
    });
});

module.exports = router;
