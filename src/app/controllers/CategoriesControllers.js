const express = require('express')
const slugify = require('slugify')

const Categories = require('../models/Categories')
const adminAuth = require('../../middlewares/adminAuth')
const router = express.Router()

//formulário de nova categoria
router.get('/admin/categories/new', adminAuth, async (req, res) => {
   return res.render('admin/categories/newCategories')
})

//listar categorias
router.get('/admin/categories', adminAuth, async (req, res) => {
   const categories = await Categories.findAll({ raw: true, order: [['id', 'ASC']] }) //pegar todas as categorias e ordenar por ID
   return res.render('admin/categories/categories', { categories })
})

//cadastrar nova categoria
router.post('/categories/save', adminAuth, async (req, res) => {
   try {
      const { title } = req.body
      if (!title) { //se estiver vazio, renderiza novamente a página
         return res.status(405).redirect('/admin/categories/new')
      } else { //senão adiciona o título e seu slug (tudo minúsculo) e redireciona à página de categorias
         await Categories.create({ title, slug: slugify(title).toLowerCase() })
         return res.status(201).redirect('/admin/categories')
      }
   } catch (error) {
      return res.status(400).redirect('/')
   }
})

//deletar uma categoria
router.post('/categories/delete', adminAuth, async (req, res) => {
   try {
      const { id } = req.body
      if (id) {
         if (!isNaN(id)) {
            await Categories.destroy({ where: { id } }) //excluir de acordo com o ID
            return res.status(200).redirect('/admin/categories')
         } else {
            return res.status(405).redirect('/admin/categories')
         }
      } else {
         return res.status(404).redirect('/admin/categories')
      }
   } catch (error) {
      return res.status(400).redirect('/')
   }
})

//editar categoria
router.get('/admin/categories/edit/:id', adminAuth, async (req, res) => {
   try {
      const { id } = req.params
      const categories = await Categories.findByPk(id) //pesquisar o ID da categoria
      if (isNaN(id)) {
         return res.status(404).redirect('/admin/categories')
      }

      if (!categories) { //se não existe a categoria
         return res.status(400).redirect('/admin/categories')
      } else { //se existe a categoria
         return res.render('admin/categories/editCategories', { categories })
      }
   } catch (error) {
      return res.status(400).redirect('/admin/categories')
   }
})

//atualizar categoria
router.post('/categories/update', adminAuth, async (req, res) => {
   try {
      const { id, title } = req.body
      await Categories.update({ title, slug: slugify(title).toLowerCase() }, { where: { id } }) //atualizar a categoria de acordo com o ID
      return res.status(200).redirect('/admin/categories')
   } catch (error) {
      return res.status(405).redirect('/admin/categories')
   }
})

module.exports = router