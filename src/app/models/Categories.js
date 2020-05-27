const Sequelize = require('sequelize')

const conn = require('../../database')

//model de categorias
const Categories = conn.define('categories', {
   title: {
      type: Sequelize.STRING,
      allowNull: false
   },
   slug: {
      type: Sequelize.STRING,
      allowNull: false
   }
})

// Categories.sync({ force: true })

module.exports = Categories