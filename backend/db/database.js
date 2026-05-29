const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Initialize tables
        db.run(`CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            game_type TEXT,
            score INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            email TEXT,
            level INTEGER DEFAULT 1,
            xp INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (!err) {
                // Try to add email column if the table already existed and lacks it
                db.run(`ALTER TABLE users ADD COLUMN email TEXT`, (alterErr) => {
                    if (alterErr) {
                        if (!alterErr.message.includes('duplicate column name') && !alterErr.message.includes('already exists')) {
                            console.warn('Note on users table schema update:', alterErr.message);
                        }
                    }
                });
            }
        });

        // Initialize OTPs table
        db.run(`CREATE TABLE IF NOT EXISTS otps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            code TEXT,
            expires_at DATETIME,
            verified INTEGER DEFAULT 0
        )`);
    }
});

module.exports = db;
