const mongoCollections = require("../config/mongoCollections");
const Apartments = mongoCollections.Apartments;
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");
const { getApartmentById } = require("./Apartments");

const createReview = async (
  ApartmentId,
  reviewTitle,
  reviewerName,
  review,
  rating
) => {
  //todo get current date
  // if (arguments.length >5) {
  //   throw "too many paramters being passed"
  // }
  helpers.checkID(ApartmentId);
  helpers.checkString(reviewTitle);
  helpers.checkString(reviewerName);
  helpers.checkString(review);
  helpers.checkNumber(rating);

  ApartmentId = ApartmentId.trim();
  reviewTitle = reviewTitle.trim();
  reviewerName = reviewerName.trim();
  review = review.trim();

  helpers.checkApartmentId(ApartmentId);
  helpers.checkReviewTitle(reviewTitle);
  helpers.checkReviewerName(reviewerName);
  helpers.checkReview(review);
  helpers.checkRating1(rating);
  if (rating % 1 === 0) {
    rating = parseInt(rating);
  } else {
    rating = rating.toPercision(2);
  }

  const ApartmentCollection = await Apartments();
  let Apartment = await getApartmentById(ApartmentId);

  //console.log(ApartmentId + "Apartment" + Apartment )
  if (Apartment === null) throw "no Apartment exists with that id9";
  let today = new Date();
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  let yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;

  //console.log(today)
  helpers.checkDateReleased(today);

  const newReview = {
    _id: ObjectId(),
    reviewTitle: reviewTitle,
    reviewDate: today,
    reviewerName: reviewerName,
    review: review,
    rating: rating,
  };
  // const newInsertInformation = await ApartmentCollection.insertOne(newReview);
  // const newId = newInsertInformation.insertedId;
  // return await getApartmentById(newId.toString());
  await ApartmentCollection.updateOne(
    { _id: ObjectId(ApartmentId) },
    { $addToSet: { reviews: newReview } }
  );
  const mov = await getApartmentById(ApartmentId);
  let overall_rating = 0;
  let c = 0;
  mov.reviews.forEach((movi) => {
    overall_rating += Number(movi.rating);
    c += 1;
  });
  overall_rating = overall_rating / c;
  overall_rating = overall_rating.toPrecision(2);
  await ApartmentCollection.updateOne(
    { _id: ObjectId(ApartmentId) },
    { $set: { overallRating: overall_rating } }
  );
  const Apartmente = await getApartmentById(ApartmentId);
  Apartmente._id = Apartmente._id.toString();
  Apartmente.reviews.forEach((m) => {
    m._id = m._id.toString();
  });
  return Apartmente;
};

const getAllReviews = async (ApartmentId) => {
  //console.log(ApartmentId)
  //console.log("Here1111")
  helpers.checkApartmentId(ApartmentId);
  //console.log("here000")
  const ApartmentCollection = await Apartments();
  //console.log("here000")
  const Apartment = await getApartmentById(ApartmentId);
  //console.log("here000")
  if (Apartment === null) throw "no Apartment exists with that id";
  Apartment.reviews.forEach((m) => {
    m._id = m._id.toString();
  });
  return Apartment.reviews;
  //return await ApartmentCollection.find(ApartmentId).toArray();
};

const getReview = async (reviewId) => {
  // if (arguements.length > 1) {
  //   throw "too many parameters being passed"
  // }
  helpers.checkID(reviewId);
  const ApartmentCollection = await Apartments();
  const mov = await ApartmentCollection.findOne({
    reviews: { $elemMatch: { _id: ObjectId(reviewId) } },
  });
  if (mov === null) throw "no review exists with that id";
  let rev = [];
  mov.reviews.forEach((r) => {
    if (r._id == r._id) {
      rev.push(r);
    }
  });
  rev[0]._id = rev[0]._id.toString();
  return rev[0];
  // const review = await reviewCollection.findOne({_id: ObjectId(reviewId)});

  // if (!review) throw 'Post not found';
  // review._id = review._id.toString();
  // return review;
};

const removeReview = async (reviewId) => {
  // if (arguments.length > 1) {
  //   throw "too many parameters passed"
  // }
  //console.log(reviewId)
  helpers.checkID(reviewId);
  reviewId = reviewId.trim();
  //console.log("bo")
  const ApartmentCollection = await Apartments();
  //console.log("hi")
  const Apartment = await ApartmentCollection.find({}).toArray();
  //console.log("bo")
  // if (Apartment.length == 0) {
  //   throw "no review exists with that id"
  // }
  let cou = 0;
  let movi = {};
  //let rev = {};
  for (j in Apartment) {
    //console.log(m)
    let tmpMov = Apartment[j];
    for (i in tmpMov.reviews) {
      //console.log("i" + i)
      //console.log("tmpMov" + tmpMov.reviews[i])
      if (tmpMov.reviews[i]._id.toString() == reviewId.toString()) {
        cou = 1;
        movi = tmpMov;
        //console.log("boy")
        //rev=tmpMov.reviews[i]
      }
    }
  }
  //console.log("bio")
  if (cou == 0) {
    throw "no reviews with that id";
  }

  //console.log("bo")
  const ApartmentId = movi._id.toString();
  const ApartmentCollection1 = await Apartments();
  const delete1 = await ApartmentCollection1.updateOne(
    { _id: ApartmentId },
    { $pull: { reviews: { _id: ObjectId(reviewId) } } }
  );
  //console.log(ApartmentId)
  const mov = await getApartmentById(ApartmentId.toString());
  //console.log("bo")
  let overall_rating = 0;
  let c = 0;
  mov.reviews.forEach((m) => {
    overall_rating += Number(m.rating);
    c += 1;
  });

  overall_rating = overall_rating / c;
  overall_rating = overall_rating.toPrecision(2);
  //console.log("bo")
  await ApartmentCollection.updateOne(
    { _id: ObjectId(ApartmentId) },
    { $set: { overallRating: overall_rating } }
  );
  //console.log("bo")
  const update = await getApartmentById(ApartmentId.toString());

  update._id = update._id.toString();
  // update.reviews.forEach(r => {
  //     r._id = r._id.toString();
  // })

  return update;
};

module.exports = { createReview, getAllReviews, getReview, removeReview };
