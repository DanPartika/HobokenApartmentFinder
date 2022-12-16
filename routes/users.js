const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");
const { getUser } = require("../data/users");
const xss = require("xss");

//router
  // .route('/')
  // .get(async (req, res) => {
  //   //code here for GET
  //   if (req.session.user) return res.redirect('/protected');
  //   else return res.render('userLogin', {title: "Login"});
  // });

router
  .route('/register') //the url would be localhost../users/register
  .get(async (req, res) => {
    //code here for GET
    try {
      if (req.session.user) return res.redirect('/protected'); //if user is already logged in and they attempt to register, goto account page
      else return res.render('userAccount/signup', {user:req.session.user});
    } catch (error) {
      return res.render('error', {title: "Error", message: error})
    }
    
  })
  .post(async (req, res) => {
    //code here for POST
    //let { usernameInput, passwordInput } = req.body
    try {
      let userData = req.body;
      let firstname = xss(userData.firstnameInput);
      let lastname = xss(userData.lastnameInput);
      let email = xss(userData.emailInput);
      let gender = xss(userData.genderInput);
      let age = xss(userData.ageInput);
      let username = xss(userData.usernameInput);
      let password = xss(userData.passwordInput);
      //let register = {};
    
      // let user = helpers.checkUsername(username);
      // let pass = helpers.checkPassword(password);
      let register = await usersData.createUser(firstname, lastname, email, gender, age, username, password);
      if (!register) throw 'Could not create user'
      //! if (register.insertedUser) return res.status(200).redirect("/");
    } catch (e) {
      let templateData = {
        title: 'Register Error',
        error: e,
        user:req.session.user
      }
      return res.status(400).render('userAccount/signup', templateData); //error
    }
    if (register.insertedUser) return res.status(200).render('userAccount/login'); //if they register send them to login
    else {
      let templateData = {
        title: 'Register',
        error: 'Internal Server Error',
        user:req.session.user
      }
      return res.status(500).render('userAccount/signup', templateData)
    }
  });
 
router
  .route('/login')
  .get(async (req, res) => {
    try {
      if (req.session.user) return res.redirect('/');
      else return res.render('userAccount/login',{user:req.session.user});
    } catch (error) {
      return res.render('error', {title: "Error", message: error})
    }
    
  })
  .post(async (req, res) => {
    //code here for POST
    let userData = req.body;
    let username = xss(userData.usernameInput)
    let password = xss(userData.passwordInput)
    let authCookie = {};
    let user = '';
    try {
      user = helpers.checkUsername(username);
      let pass = helpers.checkPassword(password);
      authCookie = await usersData.checkUser(user, pass);
    } catch (e) {
      let templateData = {
        title: 'Login Error',
        message: e,
        user:req.session.user
      }
      return res.status(400).render('error', templateData);
    }
    if (authCookie.authenticatedUser) {
      req.session.user = {
        username: user
      }

      return res.render('homepage',{user:req.session.user});
      //return res.render('userAccount/userhomepage',{user:req.session.user}); //does this have to be /users/protected?
    } else {
      let templateData = {
        title: 'Login',
        message: 'You did not provide a valid username and/or password.',
        user:req.session.user
      }
      return res.status(400).render('userAccount/userhomepage', templateData); 
    }
  })

router
  .route('/protected')
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      try {
        let curDate = new Date();
        //console.log("USERNAME:"+req.session.user.username)
        let user = await getUser(req.session.user.username);
        let templateData = {
          username: req.session.user.username, //this may be something different
          date: curDate,
          user: user
          //also might want to add other things to users account page, all apts listed, other account information
          //add user's reviews and apartments posted
        }
        return res.render('userAccount/userhomepage', templateData)
      } catch (error) {
        return res.render('error',{title:"Error",error:"Cannot get account page",user:req.session.user})
      }

    } else return res.redirect('/users/login'); 

  })

router
  .route('/logout')
  .get(async (req, res) => {
    //code here for GET
    let username = req.session.user.username;
    req.session.destroy();
    res.status(200).render('userAccount/logout', { title: "Logged Out",username:username});
  })

module.exports = router;