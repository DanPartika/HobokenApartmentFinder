const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");


router
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
    if (req.session.user) return res.redirect('/protected'); //if user is already logged in and they attempt to register, goto account page
    else return res.render('userAccount/signup');
  })
  .post(async (req, res) => {
    //code here for POST
    //let { usernameInput, passwordInput } = req.body
    let userData = req.body;
    let firstname = userData.firstnameInput;
    let lastname = userData.lastnameInput;
    let email = userData.emailInput;
    let gender = userData.genderInput;
    let age = userData.ageInput;
    let username = userData.usernameInput;
    let password = userData.passwordInput;
    let register = {};
    try {
      // let user = helpers.checkUsername(username);
      // let pass = helpers.checkPassword(password);
      register = await usersData.createUser(firstname, lastname, email, gender, age, username, password);

    } catch (e) {
      let templateData = {
        title: 'Register Error',
        error: e
      }
      return res.status(400).render('userAccount/signup', templateData); //error
    }
    if (register.insertedUser) return res.status(200).redirect('userAccount/login'); //if they register send them to login
    else {
      let templateData = {
        title: 'Register',
        error: 'Internal Server Error'
      }
      return res.status(500).render('userAccount/signup', templateData)
      }
  })
 
router
  .route('/login')
  .get(async (req, res) => {
    if (req.session.user) return res.render('apartments/aptList');
    else return res.render('userAccount/login');
  })
  .post(async (req, res) => {
    //code here for POST
    //let { username, password } = req.body
    let userData = req.body;
    let username = userData.usernameInput
    let password = userData.passwordInput
    let authCookie = {};
    let user = '';
    try {
      user = helpers.checkUsername(username);
      let pass = helpers.checkPassword(password);
      authCookie = await usersData.checkUser(user, pass);
    } catch (e) {
      let templateData = {
        title: 'Login Error',
        error: e
      }
      return res.status(400).render('userAccount/login', templateData)
    }
    if (authCookie.authenticatedUser) {
      req.session.user = {
        username: user
      }
      return res.render('userAccount/userhomepage'); //does this have to be /users/protected?
    } else {
      let templateData = {
        title: 'Login',
        error: 'You did not provide a valid username and/or password.'
      }
      return res.status(400).render('userAccount/login', templateData);
    }
  })

router
  .route('/protected')
  .get(async (req, res) => {
    //code here for GET
    try {
      let curDate = new Date();
    let templateData = {
      username: req.session.user.username, //this may be something different
      date: curDate
      //also might want to add other things to users account page, all apts listed, other account information
    }
    return res.render('userAccount/userhomepage', templateData)
    } catch (error) {
      return res.render('error',{title:"Error",error:"Cannot get account page"})
    }
    
  })

router
  .route('/logout')
  .get(async (req, res) => {
    //code here for GET
    req.session.destroy();
    res.status(200).render('userAccount/logout', { title: "Logged Out" });
  })

module.exports = router;