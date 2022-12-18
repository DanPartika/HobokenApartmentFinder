const mongoCollections = require("../config/mongoCollections");
const apartments = mongoCollections.apartments;
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");
const { getApartmentById } = require("./apartments");


const createReview = async (
  apartmentId, 
  userName,
  comments,
  rating //!include a comment title??
) => {
  let params = helpers.checkReviewsParameters(apartmentId, userName, comments, rating)
  if(!params) throw "error in checking reviews parameters";

  let apart = await getApartmentById(apartmentId)
  let reviews = apart.reviews;
  for(i in reviews) {
    if(reviews[i].userName === userName) {
      return userName;
    }
  }

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

  const newReview = {
    _id: ObjectId(), 
    reviewDate: today, 
    reviewModified: "N/A",
    userName: params.userName,
    comments: params.comments,
    rating: rating,
    numLikes: [],
    replies: []
  };

  const insertInfo = await apartmentCollection.updateOne(
    { _id: ObjectId(apartmentId) },
    { $addToSet: { reviews: newReview } }
  );
  if (insertInfo.insertedCount === 0) throw "Could not add review";

  const apt = await getApartmentById(apartmentId);
  let overall_rating = 0;
  let c = 0;
  apt.reviews.forEach((apart) => {
    overall_rating += Number(apart.rating);
    c += 1;
  });
  overall_rating = overall_rating / c;
  overall_rating = overall_rating.toPrecision(2);
  const insertInfo1 = await apartmentCollection.updateOne(
    { _id: ObjectId(apartmentId) },
    { $set: { overallRating: overall_rating } }
  );
  if (insertInfo1.insertedCount === 0) throw "Could not update rating";
  apt._id = apt._id.toString();
  apt.reviews.forEach((a) => {
    a._id = a._id.toString();
  });
  return apt.reviews[apt.reviews.length-1];
};

const getAllReviews = async (apartmentId) => {
  apartmentId = helpers.checkID(apartmentId);
  const apartment = await getApartmentById(apartmentId);
  if (apartment === null) throw "no Apartment exists with that id";
  apartment.reviews.forEach((a) => {
    a._id = a._id.toString();
  });
  return apartment.reviews;
};

const getReview = async (reviewId) => {
  reviewId = helpers.checkID(reviewId);

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
        review =  tempApartment.reviews[j];
      }
    }
  }

  if (counter === 0) throw 'Error: No review with that id';

  review._id = review._id.toString();
  return review;
};

const removeReview = async (reviewId) => {
  reviewId = helpers.checkID(reviewId);
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
  
  const apartmentId = apart._id.toString();
  const apartmentCollection1 = await apartments();
  const deletionInfo = await apartmentCollection1.updateOne(
    { _id: ObjectId(apartmentId) },
    { $pull: { reviews: { _id: ObjectId(reviewId) } } }
  );
  if (deletionInfo.deletedCount === 0) throw `Could not delete user with id of ${reviewId}`;

  const apt = await getApartmentById(apartmentId.toString());
  
  let overall_rating = 0;
  let c = 0;
  
  apt.reviews.forEach((a) => {
    overall_rating += Number(a.rating);
    c += 1;
  });

  overall_rating = overall_rating / c;

  overall_rating = overall_rating.toPrecision(2);

  if(apt.reviews.length === 0) overall_rating = 0;


  const updateInfo = await apartmentCollection.updateOne(
    { _id: ObjectId(apartmentId) },
    { $set: { overallRating: overall_rating } }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
  
  const update = await getApartmentById(apartmentId.toString());
  update._id = update._id.toString();
  return update;
};

const incrementLikesReview = async (aptId, reviewId, userName) => {
  let review = await getReview(reviewId);
  let reviewLikes = review.numLikes;
  if (reviewLikes.indexOf(userName) != -1) {
    throw "you have already liked this review";
  }
  reviewLikes.push(userName);

  const apartmentCollection = await apartments();

  let newRev = {
    _id: ObjectId(review._id),
    reviewDate: review.reviewDate,
    reviewModified: review.reviewModified,
    userName: review.userName,
    comments: review.comments,
    rating: review.rating,
    numLikes: reviewLikes,
    replies: review.replies
  };

  const updateInfo = await apartmentCollection.updateOne(
    { _id: ObjectId(aptId) },
    {$pull:{reviews:{_id: ObjectId(reviewId)}}}
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)  throw 'Update failed';

  const update = await apartmentCollection.updateOne(
    {_id: ObjectId(aptId)},
    { $addToSet: {reviews: newRev} }
  );
  if (!update.matchedCount && !update.modifiedCount) throw 'Update failed';
 
  return reviewLikes.length;
}

const newReply = async (aptId, reviewId, reply, usersName) => {
  let review = await getReview(reviewId);
  let reviewReply = review.replies;
  
  reviewReply.push({reply: reply, user: usersName});

  const apartmentCollection = await apartments();
 
  let newRev = {
    _id: ObjectId(review._id),
    reviewDate: review.reviewDate,
    reviewModified: review.reviewModified,
    userName: review.userName,
    comments: review.comments,
    rating: review.rating,
    numLikes: review.numLikes,
    replies: reviewReply
  };

  const updateInfo = await apartmentCollection.updateOne(
    { _id: ObjectId(aptId) },
    {$pull:{reviews:{_id: ObjectId(reviewId)}}}
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)  throw 'Update failed';

  const update = await apartmentCollection.updateOne(
    {_id: ObjectId(aptId)},
    { $addToSet: {reviews: newRev} }
  );
  if (!update.matchedCount && !update.modifiedCount) throw 'Update failed';
 
  return reviewReply.length;
}

module.exports = { createReview, getAllReviews, getReview, removeReview, incrementLikesReview, newReply };
