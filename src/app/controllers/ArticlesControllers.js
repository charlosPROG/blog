const express = require('express')
const slugify = require('slugify')

const Categories = require('../models/Categories')
const Articles = require('../models/Articles')
const adminAuth = require('../../middlewares/adminAuth')

const router = express.Router()

//listar artigos
router.get('/admin/articles', adminAuth, async (req, res) => {
   //buscar todos os artigos, ordenar pelo ID e incluir os dados da tabela Categoria
   const articles = await Articles.findAll({ order: [['id', 'ASC']], include: [{ model: Categories }] })
   return res.render('admin/articles/articles', { articles })
})

//listar as categorias para cadastrar os artigos
router.get('/admin/articles/new', adminAuth, async (req, res) => {
   //pegar todas as categorias e ordenar por Título
   const categories = await Categories.findAll({ raw: true, order: [['title', 'ASC']] })
   return res.render('admin/articles/newArticles', { categories })
})

//salvar um artigo
router.post('/articles/save', adminAuth, async (req, res) => {
   try {
      const { title, description, catId } = req.body

      if (!title || !description) { //se o campo título ou descrição estiver em branco
         return res.status(405).redirect('/admin/articles/new')
      } else {
         await Articles.create({
            title,
            slug: slugify(title).toLowerCase(),
            description,
            categoryId: catId
         })
         return res.status(201).redirect('/admin/articles')
      }
   } catch (error) {
      return res.status(400).redirect('/admin/articles')
   }
})

//deletar uma categoria
router.post('/articles/delete', adminAuth, async (req, res) => {
   try {
      const { id } = req.body
      if (id) {
         if (!isNaN(id)) {
            await Articles.destroy({ where: { id } }) //excluir de acordo com o ID
            return res.status(200).redirect('/admin/articles')
         } else {
            return res.status(405).redirect('/admin/articles')
         }
      } else {
         return res.status(404).redirect('/admin/articles')
      }
   } catch (error) {
      return res.status(400).redirect('/')
   }
})

//buscar dados do artigo para edição
router.get('/admin/articles/edit/:id', adminAuth, async (req, res) => {
   try {
      const { id } = req.params
      const article = await Articles.findByPk(id) //procurar um artigo de acordo com ID
      const categories = await Categories.findAll({ order: [['title', 'ASC']] }) //ordenar as categorias em ordem alfabética

      if (!article) {
         return res.status(404).redirect('/admin/articles')
      } else {
         return res.render('admin/articles/editArticles', { categories, article })
      }
   } catch (error) {
      return res.status(400).redirect('/admin/articles')
   }
})

//enviar edição
router.post('/articles/update', adminAuth, async (req, res) => {
   try {
      const { id, title, description, catId } = req.body
      await Articles.update({
         title,
         description,
         categoryId: catId,
         slug: slugify(title).toLowerCase()
      }, { where: { id } }) //atualizar o artigo de acordo com o ID
      return res.status(200).redirect('/admin/articles')
   } catch (error) {
      return res.status(400).redirect('/')
   }
})

//paginação de artigos
router.get('/articles/page/:page', adminAuth, async (req, res) => {
   const { page } = req.params
   let offset = 0 //retornará dados a partir de um valor (a partir do 0 por ser array)
   let next //indicar se existe a próxima página
   if (isNaN(page) || page === 1) {
      offset = 0
   } else {
      offset = (parseInt(page) - 1) * 5
   }

   const articles = await Articles.findAndCountAll({ limit: 5, offset, order: [['id', 'DESC']] })
   const categories = await Categories.findAll()
   if (offset + 5 >= articles.count) { //saber quantos artigos há na página para não exiber mais páginas
      next = false //não tem mais páginas
   } else {
      next = true //tem mais páginas
   }
   return res.render('admin/articles/page', { next, page: parseInt(page), articles, categories })
})

module.exports = router