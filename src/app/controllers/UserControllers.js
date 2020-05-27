const express = require('express')
const bcrypt = require('bcryptjs')

const Users = require('../models/Users')
const Categories = require('../models/Categories')
const Articles = require('../models/Articles')
const adminAuth = require('../../middlewares/adminAuth')

const router = express.Router()

router.get('/admin/users', adminAuth, async (req, res) => {
   const users = await Users.findAll({ raw: true, order: [['id', 'ASC']] })
   return res.render('admin/users/users', { users })
})

router.get('/admin/users/new', adminAuth, async (req, res) => {
   return res.render('admin/users/newUser')
})

//criar usuário
router.post('/users/create', adminAuth, async (req, res) => {
   try {
      const { email, password } = req.body

      const user = await Users.findOne({ where: { email } }) //pesquisar usuários com o mesmo e-mail
      if (!user) { //se e-mail não existe
         const salt = bcrypt.genSaltSync(10) //gerar uma sequência aleatória para a senha digitada
         const hash = bcrypt.hashSync(password, salt) //gerar a criptografia da senha
         await Users.create({ email, password: hash }) //cadastrar o usuário com a senha criptograda
         return res.redirect('/admin/users')
      } else {
         return res.redirect('/admin/users/newUser')
      }
   } catch (error) {
      return res.status(400).json({ email, hash, password })
   }
})

//deletar um usuário
router.post('/users/delete', adminAuth, async (req, res) => {
   try {
      const { id } = req.body
      if (id) {
         if (!isNaN(id)) {
            await Users.destroy({ where: { id } }) //excluir o usuário de acordo com o ID
            return res.status(200).redirect('/admin/users')
         } else {
            return res.status(405).redirect('/admin/users')
         }
      } else {
         return res.status(404).redirect('/admin/users')
      }
   } catch (error) {
      return res.status(400).redirect('/')
   }
})

//página de login
router.get('/login', async (req, res) => {
   const categories = await Categories.findAll()
   return res.render('admin/users/login', { categories })
})

//login
router.post('/auth', async (req, res) => {
   const { email, password } = req.body
   const user = await Users.findOne({ where: { email } })
   if (!user) {
      return res.status(400).redirect('/login') //caso e-mail incorreto
   } else {
      const correct = bcrypt.compareSync(password, user.password) //comparar a senha digitada com a senha do banco
      if (correct) {
         req.session.user = { id: user.id, email: user.email }
         return res.redirect('/admin/users')
      } else {
         return res.status(400).redirect('/login') //senha incorreta
      }
   }
})

router.get('/logout', async (req, res) => {
   req.session.user = undefined
   return res.redirect('/')
})

module.exports = router