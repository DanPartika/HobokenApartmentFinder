//require express and express router as shown in lecture code
const express = require("express");
const router = express.Router();
const data = require("../data");
const reviewsData = data.reviews;
const { ObjectId } = require("mongodb");
const { getAllReviews, createReview } = require("../data/reviews");
const { addReviewUser } = require("../data/users")
const helpers = require("../helpers");
const { review } = require("../data");

// router
//   .route("/:ApartmentId")
//   .get(async (req, res) => {
//     //code here for GET
//     //console.log("here010")
//     req.params.ApartmentId = req.params.ApartmentId.trim();
//     //console.log("here001")
//     if (!ObjectId.isValid(req.params.ApartmentId)) {
//       console.log("Hi")
//       res.status(400).json({ error: "Invalid ObjectID" });
//       return;
//     }
//     try {
//       //console.log("here000")
//       const reviews = await getAllReviews(req.params.ApartmentId);
//       //console.log("here100")
//       if (reviews.length == 0) {
//         res
//           .status(404)
//           .json({ error: "no reviews found for the ApartmentId entered" });
//         return;
//       }
//       res.status(200).json(reviews);
//     } catch (e) {
//       res.status(404).json({ error: e });
//     }
//   })
//   .post(async (req, res) => {
//     //code here for POST
//     let reviewPData = req.body;
//     //helpers.checkID(reviewPData.ApartmentId);

//     helpers.checkString(reviewPData.reviewTitle);
//     helpers.checkString(reviewPData.reviewerName);
//     helpers.checkString(reviewPData.review);
//     helpers.checkNumber(reviewPData.rating);

//     //reviewPData.ApartmentId = reviewPData.ApartmentId.trim();
//     reviewPData.reviewTitle = reviewPData.reviewTitle.trim();
//     reviewPData.reviewerName = reviewPData.reviewerName.trim();
//     reviewPData.review = reviewPData.review.trim();

//     // helpers.checkApartmentId(reviewPData.ApartmentId);
//     helpers.checkReviewTitle(reviewPData.reviewTitle);
//     helpers.checkReviewerName(reviewPData.reviewerName);
//     helpers.checkReview(reviewPData.review);
//     helpers.checkRating1(reviewPData.rating);

//     // if (Object.keys(reviewPData).length != 4) {
//     //   res.status(400).json({ error: 'Too many parameters in object' });
//     //   return;
//     // }
//     try {
//       const { reviewTitle, reviewerName, review, rating } = reviewPData;
//       const reviews = await reviewsData.createReview(
//         req.params.ApartmentId,
//         reviewTitle,
//         reviewerName,
//         review,
//         rating
//       );
//       res.status(200).json(reviews);
//     } catch (e) {
//       res.status(400).json({ error: e });
//     }
//   });

  router
  .route("/add-review/:apartmentId")
  .get(async (req,res) => {

    if (req.session.user) {
      return res.render('apartments/addReview',{apt:req.params.apartmentId,user:req.session.user});
    } else {
      return res.render('userAccount/login',{user:req.session.user});
    }
  })
  .post(async (req,res) => {
    //console.log(req.session.user);
    if (req.session.user) {
      // return res.render('apartments/addApt');
      try{
        let reviewData = req.body;
        
        let comment = reviewData.commentInput; 
        let rating = reviewData.ratingInput;
        let apartmentID = req.params.apartmentId
        let username = req.session.user.username

        let apt = await createReview(apartmentID, username, comment, rating);
        let allReviews = await getAllReviews(apt._id);
        console.log(allReviews.length)
        console.log("==============\n")
        let revId = allReviews[allReviews.length - 1]
        
        let reviewersName = await addReviewUser(revId._id, req.session.user.username, apt._id);
        // if(!apt.overallRating == 0) return res.render('error',{title:"Error in creating apartment"});
        //console.log(apt)
        let pathRedirect = '/apartments/apartment/' + apartmentID;
        //console.log(apt);
        res.redirect(pathRedirect);
        //res.redirect('/apartments/apartment/:apartmentId')
      } catch (e) {
        return res.render('error',{title:"Error in creating review", message:e, user:req.session.user});
      }


    } else {
      return res.render('userAccount/login',{user:req.session.user});
    }
  })


// router
//   .route("/review/:reviewId")
//   .get(async (req, res) => {
//     //code here for GET
//     req.params.reviewId = req.params.reviewId.trim();
//     if (!ObjectId.isValid(req.params.reviewId)) {
//       res.status(400).json({ error: "Invalid ObjectID" });
//       return;
//     }

//     try {
//       const reviews = await getReview(req.params.reviewId);
//       res.status(200).json(reviews);
//     } catch (e) {
//       res.status(404).json({ error: e });
//     }
//   })
//   .delete(async (req, res) => {
//     //code here for DELETE
//     req.params.reviewId = req.params.reviewId.trim();
//     if (!ObjectId.isValid(req.params.reviewId)) {
//       res.status(400).json({ error: "Invalid ObjectID" });
//       return;
//     }
//     try {
//       const reviews = await removeReview(req.params.reviewId);
//       res.status(200).json(reviews);
//     } catch (e) {
//       res.status(404).json({ error: e });
//     }
//   });

module.exports = router;
