const sqlite3 = require("sqlite3").verbose();

// ✅ Open SQLite database
const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) {
        console.error("❌ Database connection error:", err.message);
    } else {
        console.log("✅ Connected to the SQLite database.");
    }
});

// ✅ Create `orders` table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        address TEXT NOT NULL,
        items TEXT NOT NULL,
        total_price REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) {
        console.error("❌ Error creating table:", err.message);
    } else {
        console.log("✅ Orders table is ready.");
    }
});

// ✅ Export database connection
module.exports = db;
