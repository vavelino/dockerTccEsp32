module.exports={
    aute:function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg","Você deve estar logado para acessar o site")
        res.redirect("/")
    }
}