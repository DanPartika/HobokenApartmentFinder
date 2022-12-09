const express = require("express");
const router = express.Router();
const path = require('path');

router.route("/") //homepage
  .get(async (req, res) => {
    //code here for GET
    return res.sendFile(path.resolve('static/homepage.html'));
  });


module.exports = router;