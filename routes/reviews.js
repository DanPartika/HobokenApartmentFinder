//require express and express router as shown in lecture code
const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { createReview, removeReview, newReply } = require("../data/reviews");
const { addReviewUser, userRemoveReview } = require("../data/users")
const xss = require("xss");
const mongoCollections = require("../config/mongoCollections");
const apartments = mongoCollections.apartments;




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

        if(reviewId === username) {
          let pathRedirect = '/apartments/apartment/' + apartmentID;
          res.redirect(pathRedirect);
        }
        else{
          let reviewersName = await addReviewUser(reviewId._id, username, apartmentID);
          
          let pathRedirect = '/apartments/apartment/' + apartmentID;
          res.redirect(pathRedirect);
        }
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

    router
      .route("/addComment/:reviewId")
      .post(async (req,res) => {
        if (req.session.user) {
          try {
            let reviewData = req.body;
            let reply = xss(reviewData.replyInput); 
            let reviewId = req.params.reviewId;

            const apartmentCollection = await apartments();
            const apartment = await apartmentCollection.find({}).toArray();

            let count = 0;
            let apart = {};
            for (j in apartment) {
              let tmpApt = apartment[j];
              for (i in tmpApt.reviews) {
                if (tmpApt.reviews[i]._id.toString() === reviewId.toString()) {
                  count = 1;
                  apart = tmpApt;
                }
              }
            }
            if (count == 0) throw "no reviews with that id";
            
            const apartmentID = apart._id.toString();



            let newreview = await newReply(apartmentID, reviewId, reply);
            
            let pathRedirect = '/apartments/apartment/' + apartmentID;
            res.redirect(pathRedirect);
          } catch (e) {
            return res.render('error',{title:"Error in creating review", message:e, user:req.session.user});
          }
    
        } else {
          return res.render('userAccount/login',{user:req.session.user});
        }
      })

module.exports = router;
