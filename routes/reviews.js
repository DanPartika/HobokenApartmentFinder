//require express and express router as shown in lecture code
const express = require("express");
const router = express.Router();
const data = require("../data");
const reviewsData = data.reviews;
const { ObjectId } = require("mongodb");
const { getAllReviews, getReview, removeReview } = require("../data/reviews");
const helpers = require("../helpers");

router
  .route("/:ApartmentId")
  .get(async (req, res) => {
    //code here for GET
    //console.log("here010")
    req.params.ApartmentId = req.params.ApartmentId.trim();
    //console.log("here001")
    if (!ObjectId.isValid(req.params.ApartmentId)) {
      res.status(400).json({ error: "Invalid ObjectID" });
      return;
    }
    try {
      //console.log("here000")
      const reviews = await getAllReviews(req.params.ApartmentId);
      //console.log("here100")
      if (reviews.length == 0) {
        res
          .status(404)
          .json({ error: "no reviews found for the ApartmentId entered" });
        return;
      }
      res.status(200).json(reviews);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    let reviewPData = req.body;
    //helpers.checkID(reviewPData.ApartmentId);

    helpers.checkString(reviewPData.reviewTitle);
    helpers.checkString(reviewPData.reviewerName);
    helpers.checkString(reviewPData.review);
    helpers.checkNumber(reviewPData.rating);

    //reviewPData.ApartmentId = reviewPData.ApartmentId.trim();
    reviewPData.reviewTitle = reviewPData.reviewTitle.trim();
    reviewPData.reviewerName = reviewPData.reviewerName.trim();
    reviewPData.review = reviewPData.review.trim();

    // helpers.checkApartmentId(reviewPData.ApartmentId);
    helpers.checkReviewTitle(reviewPData.reviewTitle);
    helpers.checkReviewerName(reviewPData.reviewerName);
    helpers.checkReview(reviewPData.review);
    helpers.checkRating1(reviewPData.rating);

    // if (Object.keys(reviewPData).length != 4) {
    //   res.status(400).json({ error: 'Too many parameters in object' });
    //   return;
    // }
    try {
      const { reviewTitle, reviewerName, review, rating } = reviewPData;
      const reviews = await reviewsData.createReview(
        req.params.ApartmentId,
        reviewTitle,
        reviewerName,
        review,
        rating
      );
      res.status(200).json(reviews);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  });

router
  .route("/review/:reviewId")
  .get(async (req, res) => {
    //code here for GET
    req.params.reviewId = req.params.reviewId.trim();
    if (!ObjectId.isValid(req.params.reviewId)) {
      res.status(400).json({ error: "Invalid ObjectID" });
      return;
    }

    try {
      const reviews = await getReview(req.params.reviewId);
      res.status(200).json(reviews);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    req.params.reviewId = req.params.reviewId.trim();
    if (!ObjectId.isValid(req.params.reviewId)) {
      res.status(400).json({ error: "Invalid ObjectID" });
      return;
    }
    try {
      const reviews = await removeReview(req.params.reviewId);
      res.status(200).json(reviews);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });

module.exports = router;
