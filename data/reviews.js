const mongoCollections = require("../config/mongoCollections");
const apartments = mongoCollections.apartments;
const { ObjectId, Db } = require("mongodb");
const helpers = require("../helpers");
const { getApartmentById } = require("./apartments");
const { dbConnection } = require("../config/mongoConnection");

const createReview = async (
  apartmentId, 
  userName,
  comments,
  rating //!include a comment title??
) => {
  let params = helpers.checkReviewsParameters(apartmentId, userName, comments, rating)

  if (params.rating % 1 === 0) {
    params.rating = parseInt(params.rating);
  } else {
    params.rating = params.rating.toPercision(2);
  }
  const apartmentCollection = await apartments();
  let apartment = await getApartmentById(apartmentId);

  if (apartment === null) throw "no Apartment exists with that id";
  let today = new Date();
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  let yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;

  /*apartmentId, 
  userId,
  userName,
  comments,
  rating*/
  const newReview = {
    _id: ObjectId(), //include userID??
    //reviewTitle: params.reviewTitle,
    reviewDate: today, //added this.
    reviewModified: "N/A",
    userName: params.userName,
    comments: params.comments,
    rating: rating,
    numLikes: 0,
    numDislikes: 0
  };
  // const newInsertInformation = await ApartmentCollection.insertOne(newReview);
  // const newId = newInsertInformation.insertedId;
  // return await getApartmentById(newId.toString());
  await apartmentCollection.updateOne(
    { _id: ObjectId(apartmentId) },
    { $addToSet: { reviews: newReview } }
  );
  
  const apt = await getApartmentById(apartmentId);
  let overall_rating = 0;
  let c = 0;
  apt.reviews.forEach((apart) => {
    overall_rating += Number(apart.rating);
    c += 1;
  });
  overall_rating = overall_rating / c;
  overall_rating = overall_rating.toPrecision(2);
  await apartmentCollection.updateOne(
    { _id: ObjectId(apartmentId) },
    { $set: { overallRating: overall_rating } }
  );
  //const apartmente = await getApartmentById(apartmentId);
  apt._id = apt._id.toString();
  apt.reviews.forEach((a) => {
    a._id = a._id.toString();
  });
  //return apt;
  return apt.reviews[apt.reviews.length-1];
};

const getAllReviews = async (apartmentId) => {
  apartmentId = helpers.checkID(apartmentId);
  const apartmentCollection = await apartments();
  const apartment = await getApartmentById(apartmentId);
  if (apartment === null) throw "no Apartment exists with that id";
  apartment.reviews.forEach((a) => {
    a._id = a._id.toString();
  });
  return apartment.reviews;
};

const getReview = async (reviewId) => {
  reviewId = helpers.checkID(reviewId);
  reviewId = reviewId.trim();
  //console.log(reviewId);

  if (!ObjectId.isValid(reviewId)){
    throw 'Error: invalid object ID';
  } 

  const apartmentCollection = await apartments();
  const newApartmentCollection = await apartmentCollection.find({}).toArray();


  let review = {};
  let counter = 0;

  for(i in newApartmentCollection) {
    let tempApartment = newApartmentCollection[i];
    for(j in tempApartment.reviews) {
      if(tempApartment.reviews[j]._id.toString() === reviewId) {
        counter = 1;
        review =  tempApartment.reviews[j]
      }
    }
  }

  if (counter === 0){
    throw 'Error: No review with that id';
  } 

  review._id = review._id.toString();
  return review;

};

const removeReview = async (reviewId) => {
  reviewId = helpers.checkID(reviewId);
  const apartmentCollection = await apartments();
  const apartment = await apartmentCollection.find({}).toArray();
  // if (apartment.length == 0) throw "no review exists with that id"
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
  
  const apartmentId = apart._id.toString();
  const apartmentCollection1 = await apartments();
  const delete1 = await apartmentCollection1.updateOne(
    { _id: ObjectId(apartmentId) },
    { $pull: { reviews: { _id: ObjectId(reviewId) } } }
  );

  const apt = await getApartmentById(apartmentId.toString());
  
  let overall_rating = 0;
  let c = 0;
  
  apt.reviews.forEach((a) => {
    overall_rating += Number(a.rating);
    c += 1;
  });

  overall_rating = overall_rating / c;

  overall_rating = overall_rating.toPrecision(2);

  if(apt.reviews.length === 0) {
    overall_rating = 0;
  }

  await apartmentCollection.updateOne(
    { _id: ObjectId(apartmentId) },
    { $set: { overallRating: overall_rating } }
  );
  const update = await getApartmentById(apartmentId.toString());
  
  update._id = update._id.toString();
  return update;
};

const incrementLikesReview = async (aptId, reviewId) => {
  let review = await getReview(reviewId);
  let reviewLikes = review.numLikes;
  reviewLikes = reviewLikes + 1;

  const apartmentCollection = await apartments();

  let newRev = {
    _id: ObjectId(review._id),
    reviewDate: review.reviewDate,
    reviewModified: review.reviewModified,
    userName: review.userName,
    comments: review.comments,
    rating: review.rating,
    numLikes: reviewLikes,
    numDislikes: review.numDislikes,
  };

  const deletionInfo = await apartmentCollection.updateOne(
    { _id: ObjectId(aptId) },
    {$pull:{reviews:{_id: ObjectId(reviewId)}}}
  );
  // if(deletionInfo.modifiedCount === 1) {
  //   console.log("deletes")
  // }

  const update = await apartmentCollection.updateOne(
    {_id: ObjectId(aptId)},
    { $addToSet: {reviews: newRev} }
  );
 
  return await getReview(reviewId);
}

module.exports = { createReview, getAllReviews, getReview, removeReview, incrementLikesReview };
