const Sequelize = require('sequelize')

const conn = require('../../database')

//model de categorias
const Users = conn.define('users', {
   email: {
      type: Sequelize.STRING,
      allowNull: false
   },
   password: {
      type: Sequelize.STRING,
      allowNull: false
   }
})

// Users.sync({ force: true })

module.exports = Users