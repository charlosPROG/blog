const Sequelize = require('sequelize')

const conn = require('../../database')
const Categories = require('./Categories')

//model de artigos
const Articles = conn.define('articles', {
   title: {
      type: Sequelize.STRING,
      allowNull: false
   },
   slug: {
      type: Sequelize.STRING,
      allowNull: false
   },
   description: {
      type: Sequelize.TEXT,
      allowNull: false
   }
})

// #-- RELACIONAMENTO ENTRE TABELAS --#
//categoria tem muitos artigos
Categories.hasMany(Articles)
//artigo pertence a (belongsTo) uma categoria
Articles.belongsTo(Categories)

// Articles.sync({ force: true })

module.exports = Articles