const express = require('express')
const path = require('path')
const session = require('express-session')

const routes = require('./routes')
const conn = require('./src/database')
const app = express()

const PORT = process.env.PORT || 8080
const pasta = path.join(__dirname, './src/views')

conn
   .authenticate()
   .then(() => console.log('Conexão com sucesso'))
   .catch(err => console.log(err))

app.set('views', pasta)
app.set('view engine', 'ejs')

app.use(session({ secret: 'palavra', cookie: { maxAge: 1000000 }, resave: true, saveUninitialized: true })) //sessão
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(routes)

app.listen(PORT, () => console.log(`O servidor está rodando na porta: ${PORT}`))