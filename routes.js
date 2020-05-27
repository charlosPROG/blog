const express = require('express')

const CategoriesControllers = require('./src/app/controllers/CategoriesControllers')
const ArticlesControllers = require('./src/app/controllers/ArticlesControllers')
const UsersControllers = require('./src/app/controllers/UserControllers')

const Articles = require('./src/app/models/Articles')
const Categories = require('./src/app/models/Categories')
const Users = require('./src/app/models/Users')

const router = express.Router()

router.use('/', [CategoriesControllers, ArticlesControllers, UsersControllers])

router.get('/session', async (req, res) => { //sessão
   req.session.teste = 'teste'
   req.session.ano = 'ano'
   req.session.user = 'user'
   req.session.email = 'email'
   return res.status(201).send('foi')
})

router.get('/read', async (req, res) => { //ler sessão
   return res.json({
      teste: req.session.teste,
      ano: req.session.ano,
      user: req.session.user,
      email: req.session.email
   })
})

router.get('/', async (req, res) => {
   //ordernar do mais novo para o mais velho
   const articles = await Articles.findAll({ order: [['id', 'DESC']], limit: 5 })
   const categories = await Categories.findAll()
   res.render('index', { articles, categories })
})

router.get('/:slug', async (req, res) => {
   //todos os slugs
   try {
      const { slug } = req.params
      const article = await Articles.findOne({ where: { slug } })
      const categories = await Categories.findAll()
      if (!article) {
         return res.status(404).redirect('/')
      } else {
         return res.render('article', { article, categories })
      }
   } catch (error) {
      return res.status(400).redirect('/')
   }
})

router.get('/categories/:slug', async (req, res) => {
   //categorias por slug
   try {
      const { slug } = req.params
      const categories = await Categories.findOne({ where: { slug }, include: [{ model: Articles }] })
      if (!categories) {
         return res.status(404).redirect('/')
      } else {
         const cat = await Categories.findAll()
         return res.render('index', { articles: categories.articles, categories: cat })
      }
   } catch (error) {
      return res.status(400).redirect('/')
   }
})

module.exports = router