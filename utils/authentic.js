module.exports = isLoggedIn = (req,res,next)=>{
  if(!req.isAuthenticated())
  {
    // console.log(req.path,req.originalUrl)
    req.session.retrunTo = req.originalUrl;
    req.flash('error','You must be Logged In !');
    return res.redirect('/login');
  }
  next();
}
