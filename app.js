
// Setup server, session and middleware here.
const express = require('express');
const app = express();
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const multer = require("multer");
const fs = require('fs');
const { addFilePathtoApt } = require('./data/apartments');


app.use(express.static('images'));
app.use(express.static("uploads"));
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(express.static('views'));
app.use(express.static(__dirname + '/views'));
app.use(express.static("public"));
app.use('/public', express.static(__dirname +'/public'));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  
    cb(null, path.join(__dirname,'/uploads'))
  },
  filename: function (req, file, cb) {
    //console.log("file",file);  
    fileExtension = file.originalname.split('.')[1]
    // console.log("Date: " + __dirname)
    let length = fs.readdirSync(__dirname+'/uploads').length
    cb(null, length +'.'+fileExtension)
  }

})

var upload = multer({ storage: storage })

app.set('view engine','handlebars');
app.engine('handlebars', exphbs.engine({ defaultLayout: __dirname+ '/views/layouts/main' }))


//app.use('/uploads', express.static('uploads'));

app.set('views', path.join(__dirname, 'views'));


// app.use(express.static(__dirname + '/public'));
// const static = express.static(__dirname + '/public');
// app.use(express.static('images'));
// app.use('/public', static);
// app.use(express.static('uploads'));



app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
//app.set('view engine', 'handlebars')

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}))


// Authentication middleware
app.use('/protected', async (req, res, next) => {
  if (req.session.user) next()
  else {
    return res.status(403).render('userAccount/forbiddenAccess')
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

// app.engine('handlebars',exphbs.engine({ defaultLayout : __dirname + "/views/apartments/editApt" }));

// app.get("/apartments/editApartment/::apartmentId", (req, res) => {
//   res.render("apartments/editApt")
// })


app.post("/apartments/apartment/uploadimage/:id",upload.single('samplefile'),async function (req, res, next) {
  // response += `<img src="${req.file.path}" /><br>`
  //response += `<img src ="uploads/${req.file.filename}"/>`                 
   //return res.sendFile(req.file.path)
   try {
    const aptId = req.params.id
    fs.readdirSync(__dirname+'/uploads').length
    var files = fs.readdirSync(__dirname+'/uploads');
    //console.log("\n\nFILES: " + files + "\n\n")
    //files is array, get next to last element, get the .""
    let fileExtension = files[files.length-2].split('.')[1]
    //console.log(fileExtension)
    let newApt = await addFilePathtoApt(aptId,"/uploads/" + (fs.readdirSync(__dirname+'/uploads').length-1).toString()+"."+fileExtension )
    res.redirect('/apartments/apartment/'+aptId)
   } catch (error) {
    res.render('error', {message:error})
   }
   
});
  //  var response = '<a href="/">Home</a><br>'
  //  response += "Files uploaded successfully.<br>"
  // // response += `<img src="${req.file.path}" /><br>`
  // response += `<img src ="uploads/${req.file.filename}"/>`                 
  //  return res.send(response)
   //return res.sendFile(req.file.path);
   //return res.send(`<img src="${req.file.path}"/>`);







configRoutes(app);


app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
