//require express and express router as shown in lecture code
const express = require("express");
const router = express.Router();
const data = require("../data");
const reviewsData = data.reviews;
const { ObjectId } = require("mongodb");
const { getAllReviews, createReview, removeReview } = require("../data/reviews");
const { addReviewUser, userRemoveReview } = require("../data/users")
const helpers = require("../helpers");
const { review } = require("../data");
const xss = require("xss");



  router
  .route("/add-review/:apartmentId")
  .get(async (req,res) => {
    try {
      if (req.session.user) return res.render('apartments/addReview',{apt:req.params.apartmentId, user:req.session.user});
      else return res.render('userAccount/login',{user:req.session.user});
    } catch (error) {
      return res.render('error', {title: "Error", message: error})
    }
    
  })
  .post(async (req,res) => {
    if (req.session.user) {
      try {
        let reviewData = req.body;
        let comment = xss(reviewData.commentInput); 
        let rating = xss(reviewData.ratingInput);
        let apartmentID = req.params.apartmentId;
        let username = req.session.user.username;
        let reviewId = await createReview(apartmentID, username, comment, rating);
        
        let reviewersName = await addReviewUser(reviewId._id, username, apartmentID);
        
        let pathRedirect = '/apartments/apartment/' + apartmentID;
        res.redirect(pathRedirect);
      } catch (e) {
        return res.render('error',{title:"Error in creating review", message:e, user:req.session.user});
      }

    } else {
      return res.render('userAccount/login',{user:req.session.user});
    }
  });

  router
    .route("/deleteReview/:reviewId")
    .post(async (req,res) => {
      try {
        if (req.session.user) {
          req.params.reviewId = req.params.reviewId.trim();

          if (!ObjectId.isValid(req.params.reviewId)) return res.render('error', {title: "Id is not valid"})//({ error: 'Invalid ObjectID' });

          const review = await removeReview(req.params.reviewId);
          if (!review) throw `Could not remove review with id of ${req.params.reviewId}`

          const userupdate = await userRemoveReview(req.session.user.username,req.params.reviewId)
          if (!userupdate) throw `Could not remove review from user ${req.session.user.username}`

          return res.redirect('/users/protected');
        } else return res.render('userAccount/login',{user:req.session.user});
      } catch (e) {
        res.render('error', {title: "Error", message: e});
      }
    })

module.exports = router;
