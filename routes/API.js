const express = require('express');
const router = express.Router();
const path = require('path');

router
  .route('/')
  .get(async (req, res) => {
    try {
      if (req.session.username) { //if logged in go to user home page
        return res.render('', { });
      } else { //otherwise go to website home page 
        return res.sendFile(path.resolve('static/homepage.html'));
      }
      
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });

module.exports = router;