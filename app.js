// Setup server, session and middleware here.
const express = require('express');
const app = express();
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session');
const multer = require("multer");
const static = express.static(__dirname + '/public');


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}))
app.use(express.static('images'));
app.use('/public', static);

// Authentication middleware
app.use('/protected', async (req, res, next) => {
  if (req.session.user) next()
  else {
    return res.status(403).render('forbiddenAccess')
  }
})


// Logging middleware
app.use(async (req, res, next) => {
  const timestamp = new Date().toUTCString()
  const method = req.method
  const route = req.originalUrl
  const authCookie = `${req.session.user ? 'Authenticated' : 'Non-Authenticated'} User`
  const log = `[${timestamp}]: ${method} ${route} (${authCookie})`
  console.log(log)
  next()
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })
 app.use(express.static(__dirname + '/views/apartments'));
const static1 = express.static(__dirname + "/uploads");
app.use("/uploads", static1);

app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  console.log(JSON.stringify(req.file))
  var response = '<a href="/">Home</a><br>'
  response += "Files uploaded successfully.<br>"
  response += `<img src="${req.file.path}" /><br>`
  return res.send(response)
})




configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
