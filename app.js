require('dotenv').config()
const express = require('express')
const multer = require('multer')
const bcrypt = require('bcryptjs')
const path = require('path')
const db = require('./database')

const app = express()
const PORT = process.env.PORT || 3801

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// 傻逼华为
app.use((req, res, next) => {
    const userAgent = req.headers['user-agent'].toLowerCase()
    if (userAgent && (userAgent.includes('huawei') || userAgent.includes('harmony'))) {
        return res.status(403).send('Access Forbidden for Huawei devices')
    }
    next()
})


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

app.get('/', (req, res) => {
    db.all("SELECT * FROM images", [], (err, rows) => {
        if (err) {
            throw err
        }
        res.render('index', { images: rows })
    })
})

app.post('/upload', upload.single('image'), (req, res) => {
    const filename = req.file.filename
    const originalname = Buffer.from(req.file.originalname, 'latin1').toString('utf-8')
    console.log(req.file)
    const password = req.body.password || ''
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : ''

    db.run("INSERT INTO images (filename, originalname, password) VALUES (?, ?, ?)", [filename, originalname, hashedPassword], function(err) {
        if (err) {
            return res.send('Error storing image information.')
        }
        res.redirect('/')
    })
})

app.get('/image/:filename', (req, res) => {
    const filename = req.params.filename

    db.get("SELECT password FROM images WHERE filename = ?", [filename], (err, row) => {
        if (err) {
            return res.send('Error retrieving image information.')
        }
        if (!row || !row.password) {
            res.sendFile(path.join(__dirname, 'public/uploads', filename))
        } else {
            res.render('preview', { filename: filename })
        }
    })
})


app.post('/image/:filename', (req, res) => {
    const { password } = req.body
    const filename = req.params.filename

    db.get("SELECT password FROM images WHERE filename = ?", [filename], (err, row) => {
        if (err) {
            return res.send('Error retrieving image information.')
        }
        if (!row.password || (row.password && bcrypt.compareSync(password, row.password))) {
            res.sendFile(path.join(__dirname, 'public/uploads', filename))
        } else {
            res.send('<script>alert("Incorrect password"); window.history.back();</script>')
        }
    })
})



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
