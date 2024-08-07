const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const dbPath = path.resolve(__dirname, 'image-hosting.db')

const db = new sqlite3.Database(dbPath)

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT,
        originalname TEXT,
        uploader TEXT,
        upload_time DATE,
        password TEXT
    )`)
    
    db.run(`CREATE TABLE IF NOT EXISTS short_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shortUrl TEXT,
        longUrl TEXT,
        uaFilter TEXT
    )`)

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        username TEXT,
        password TEXT
    )`)
})

module.exports = db
