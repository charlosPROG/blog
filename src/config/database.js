module.exports = {
   dialect: 'postgres', //tipo de banco
   host: 'localhost', //onde está o servidor
   port: 5432, //porta
   username: 'postgres', //usuário
   password: '123456', //senha
   database: 'blog', //nome do banco,
   timezone: '-03:00', //fuso horário brasileiro
   define: {
      timestamps: true, //criará as colunas created_at e updated_at
      underscored: false //nome das tabelas e colunas no formato camelCase
   }
}