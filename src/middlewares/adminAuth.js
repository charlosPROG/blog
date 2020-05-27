module.exports = function adminAuth(req, res, next) {
   if (req.session.user) { //se a sessão user existir
      next() //dar continuidade à requisição
   } else {
      return res.redirect('/login')
   }
}