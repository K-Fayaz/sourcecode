  const express = require('express');
  const router = express.Router();
  const db = require("../Models/index");
  const Blog = require('../Models/blog');
  const Reply = require('../Models/replyModel');
  const Comment = require('../Models/commentModel');
  const User = require('../Models/userModel');
  let isLoggedIn = require('../utils/authentic');
  const { sendNewsletterToList , getListID } = require("../helpers/subscribers.helper");
  const { isFloat } = require("../helpers/page.helper");
  const nodemailer = require('nodemailer');
  const mailgun = require('nodemailer-mailgun-transport');

  // SnBoTPL3XGplXBal

 //  requiring the package to produce random string
 const randomString = require("randomstring");

 const auth = {
   auth:{
     api_key:'e19cf1cafad3f268f6aaecf3fae13d3c-a3c55839-1ee4a112',
     domain:'sandboxedf2ec0811114838b02a5960083d18cd.mailgun.org'
   }
 };

 const transporter = nodemailer.createTransport(mailgun(auth));

  var pass = '';
  var id = '';

  // sending newsletter to sunscribers
  const sgMail = require('@sendgrid/mail');
  const sgClient = require('@sendgrid/client');

  // The home page
  router.get('/',async (req,res)=>{
    try{
      const blogs = await Blog.find({}).limit(3);
      res.render('Home',{ blogs });
    }
    catch(err){
      res.render("notFound");
    }
  });

  // new blog post form
  router.get('/new/blog',(req,res)=>{
    try{
      if(!res.locals.currentUser || res.locals.currentUser.email != process.env.ADMIN_EMAIL)
        throw Error('1');
      res.render("blogForm");
    }
    catch(err){
      // console.log(err);
      if(err == '1'){
         res.send("You are not Authorized");
      }else{
        res.render("notFound");
      }
    }
  });

  // all blogs page
  router.get('/all-blog-post/',async (req,res)=>{
    try{
      let { page } = req.query;   // getting the number of requested page
      if(page === undefined)
      {
        page = 1;
      }
      let start = page * 4 - 4;
      const allBlogs = await Blog.find({});
      let pageBlogs = allBlogs.slice(start,start + 4);

      // finding the number of pages avaialable
      let numPage = allBlogs.length / 4;
      if(isFloat(numPage)){
        numPage = Math.floor(numPage) + 1;
      }
      // console.log(`Total number of pages would be ${numPage}`);
      res.render('allBlogs',{ allBlogs:pageBlogs , length: numPage , currentPage:page , admin:process.env.ADMIN_EMAIL });
    }
    catch(err){
      res.render("notFound");
    }
  })


  // creating a new blog page
  router.post('/new/blog',async (req,res)=>{

    // try if there is an error
    try{
      //creating the blog
      if(!res.locals.currentUser || res.locals.currentUser.email != process.env.ADMIN_EMAIL)
      {
        throw Error("1");
      }
      const newBlog = new Blog;
      newBlog.title = req.body.title;
      if(req.body.image){
        newBlog.image = req.body.image;
      }
      newBlog.description = req.body.description;
      newBlog.body = req.body.blogData;
      newBlog.category = req.body.category;
      await newBlog.save();

      // sending newsletters
      const listID = await getListID('sourceCode Newsletter Subscribers');

      // creating object of essentials
      let essentials = {
        image:req.body.image,
        title:req.body.title,
        url: req.protocol + '://' + req.headers.host +`/read/blog/${newBlog._id}`
      }

      console.log(essentials);

      await sendNewsletterToList(req,essentials,listID);
      res.redirect('/');
    }
    catch(err){
      res.redirect("/error");
    }
  })

  // liking the blog page
  router.put("/blog/:id/like",async(req,res)=>{
    const { id } = req.params;
    const blog = await Blog.findById(id);
    let like = blog.likes;
    // console.log(like);
    db.Blog.findByIdAndUpdate(id, { likes:like + 1 })
      .then(async (success)=>{
        await blog.save();
        res.json('Status 200 OK');
      })
      .catch((error)=>{
        console.log("Sorry ! ERror");
        console.log(error);
      })
  });

  // getting the likes for a post
  router.get("/blog/:id/get/likes",(req,res)=>{
    const { id } = req.params;
    db.Blog.findById(id)
      .then((data)=>{
        res.json(data);
        // console.log(data);
      })
      .catch((error)=>{
        console.log(error);
      })
  })

  router.get("/read/blog/:id",async(req,res)=>{
    try{
      let { id } = req.params;
      let blog = await Blog.findById(id)
                  .populate({path:'comments',
                    populate:{
                      path:'owner'
                    }})
                    .populate({path:'comments',
                    populate:{
                      path:'reply',
                      populate:{
                        path:'author'
                      }
                    }});

      let body = blog.body;
      let description = blog.description;
      res.render("viewBlog",{blog});
    }
    catch(err){
      res.render("notFound");
    }

    // res.send(blog)
  })

  // delete the blog post
  router.delete('/blog/delete/:id',async(req,res)=>{
    // find the post and delete
    try
    {
      if(res.locals.currentUser == undefined || res.locals.currentUser.email != process.env.ADMIN_EMAIL)
        throw 1;
      else{
        let blog = await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json('post deleted successfully!');
      }
    }
    catch(err){
      if(err == 1)
        // set status to 401- Unauthorized
        res.status(401).json('You are Unauthorized!');
      else {
        // set status to 400 - Bad Request
        res.status(400).json('Something went wrong!');
      }
    }
  })

  // edit pages
  router.post("/blog/edit/:id",async (req,res)=>{
    try{
      if(!res.locals.currentUser || res.locals.currentUser.email != process.env.ADMIN_EMAIL)
        res.send("401 Unauthorized");
      pass = randomString.generate(8);
      const mailOptions = {
        from:'fayazkudremane2001@gmail.com',
        to:'kfayaz1407@gmail.com',
        subject:'Edit Blog page Request',
        text:`Hey here is your password to edit page , ${pass}`
      };

      await transporter.sendMail(mailOptions,function(err,success){
        if(err){
          res.send(err.message)
        }else{
          console.log('Email sent!');
          id = req.params.id;
          res.redirect('/password/edit-request/');
        }
      });
    }
    catch(err){
      res.redirect("/error");
    }
  })

  router.get("/password/edit-request/",(req,res)=>{
    try{
      if(!res.locals.currentUser  || res.locals.currentUser.email != process.env.ADMIN_EMAIL)
        return res.send("<b>401 Unauthorized User !</b><br><a href='/'>Home</a>");
      res.render('password');
    }
    catch(err){
      res.render("notFound");
    }
  });

  // Validate if entered password is correct
  router.post("/password/validate/",async(req,res)=>{
    try{

      // check if user is authenticated ?
      if(!res.locals.currentUser || res.locals.currentUser.email != process.env.ADMIN_EMAIL)
        throw 2;

      let { password } = req.body;

      // find the blog post
      let blog = await Blog.findById(id);
      if(!blog)
        throw 1;

      // check if the entered password is correct ?
      console.log(pass);
      if(password == pass)
        res.redirect(`/blog/edit/${blog._id}?password=${password}`); // redirect to edit blog page with found blog post
      else{
        throw 3; // throw an error
      }

    }
    catch(err)
    {
      if(err == 1) // Blog post was not found
        res.send("Sorry Unable to find the blog You are searching!");

      if(err == 2) // Unauthorized User
        res.send(`<b>401 Unauthorized User !</b><br><a href='/'>Home</a>`);

      if(err == 3) // Entered password was wrong !
        res.send(`<b>It seems that You have entered a wrong password.</b>
        <br><a href="/password/edit-request/">Try again ?</a><br><a href="/">Home</a>`);
    }
  })

  // put

  // handle edit page validations
  router.get('/blog/edit/:id/',async(req,res)=>{
    try{
      // check again if password is correct
      let { password } = req.query;
      if(!password || password != pass)
        throw 1; // password is wrong

      // check if User is logged IN ?
      if(!res.locals.currentUser || res.locals.currentUser.email != process.env.ADMIN_EMAIL)
        throw 2;

      // Now find the blog post and redirect to edit page
      let blog = await Blog.findById(req.params.id);
      if(!blog)
        throw 3;

      // redirect to edit page as the blog is found
      res.render("editBlogPage",{ blog:blog });

    }
    catch(err)
    {
      if(err == 1)
        res.send(`<b>400 Bad Request!</b><br><a href="/">Home</a>`)
      else if(err == 2)
        res.send(`<b>401 Unauthorized User !</b><br><a href='/'>Home</a>`);
      else if(err == 3)
        res.send("<b>Unable to find Blog Post!</b><br><a href='/'>Home</a>");
    }
  })

  // handle blog edit form request
  router.put('/blog/edit/:id/request',async(req,res)=>{
    try{
      // try finding the blog post
      let blog = await Blog.findById(req.params.id);
      blog.title = req.body.title;

      if(req.body.image){
        blog.image = req.body.image;
      }

      blog.description = req.body.description;
      blog.body = req.body.blogData;
      blog.category = req.body.category;
      blog.edited = true;

      await blog.save();

      res.redirect(`/read/blog/${blog._id}/`);

    }
    catch(err)
    {
      res.redirect('/error');
    }
  })

  // ********** ------ **********
  //     Managing the comment
  // ********** ------ **********

  router.post("/blogpost/comment/:id/new/:userId",async (req,res)=>{
    try{
      let { username , comment } = req.body;
      let { id , userId } = req.params;
      // find the User
      let user = await User.findById(userId);
      // *** find the blog post ***
      const post = await Blog.findById(id);
      console.log(user,post);
      let newComment = new Comment;   // Create a new comment item and
      newComment.owner = user;       // assign values to it
      newComment.comment = comment;
      await newComment.save();        // Save the newly created comment

      post.comments.unshift(newComment);   // insert the comment in the
      await post.save();                    // post that belongs

      user.comments.unshift(newComment);    // save the comment to the
      await user.save();                    // User that belongs to
      // console.log(post.comments);
      res.redirect(`/read/blog/${id}/#commentsContainer`);
    }
    catch(err){
      res.redirect('/error');
    }
  })


  // creating a reply to a comment
  router.post('/blog/:blogId/comment/:commentId/reply-data/:userId',async(req,res)=>{
      let { blogId , commentId , userId } = req.params;
      let { replyUser , replyComment } = req.body;

      // Find the User
      let user = await User.findById(userId);

      let reply = new Reply;        // Create a reply
      reply.author = user;
      reply.reply = replyComment;
      await reply.save();

      // find the comment for which user is replying and append reply to it
      let comment = await Comment.findById(commentId);
      comment.reply.unshift(reply);
      await comment.save();
      res.redirect(`/read/blog/${blogId}/#commentsContainer`);
  })


  // Deleting a reply that has made
  router.delete('/blog/comment/:id/reply/:replyId',async(req,res)=>{
      let { replyId , id } = req.params;

      // find the comment and pull the reply from the comment
      await Comment.findByIdAndUpdate(id,{$pull:{reply:replyId}})

      // deleting throgh XML request
      db.Reply.findByIdAndDelete({_id:replyId})
        .then((data)=>{
          res.send('OK')
        }).catch((error)=>{
          res.send('ERROR')
        })
  });

  // deleting the comment on a blog
  router.delete('/blog/:blogId/comment/:id/delete/:userId',async(req,res)=>{
      let { id , blogId , userId } = req.params;

      // find the blog post the comment belongs to and pull out the
      //comment from there ** DELETE IT **
      await Blog.findByIdAndUpdate(blogId,{$pull:{comments:id}});

      // Find the comment users trying to delete and find all the replies
      // present in it and delete them all !

      let comment  = await Comment.findById(id).populate('reply');
      comment.reply.forEach(async (item, i) => {
        await Reply.findByIdAndDelete(item._id)
      });

      // Pull the comment from the User collection
      let user =  await User.findByIdAndUpdate(userId,{$pull:{comments: id }});
      await user.save();

      // Now delete the comment
      db.Comment.findByIdAndDelete(id)
        .then((data)=>{
          res.send('OK deleted')
        })
        .catch((err)=>{
          console.log(err);
        })
  })

  module.exports = router;
