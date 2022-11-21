//Daniel Partika
//I pledge my honor that I have abided by the Stevens Honors System.
const mongoCollections = require("../config/mongoCollections");
const Apartments = mongoCollections.Apartments;
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");

const createApartment = async (
  _id,
  ApartmentName,
  streetAddress,
  rentPerMonth,
  rentDuration,
  maxResidents,
  numBedrooms,
  numBathrooms,
  laundry,
  floorNum,
  roomNum,
  appliancesIncluded,
  maxPets,
  utilitiesIncluded
) => {
  helpers.checkString();
  helpers.checkString();
  helpers.checkArray();
  helpers.checkString();
  helpers.checkString();
  helpers.checkString();
  helpers.checkArray();
  helpers.checkString();
  helpers.checkString();

  helpers.checkTitle(title);
  helpers.checkStudio(studio);
  helpers.checkDirector(director);
  helpers.checkRating(rating);
  helpers.checkGenres(genres);
  helpers.checkCastMembers(castMembers);
  helpers.checkDateReleased(dateReleased);
  helpers.checkRuntime(runtime);

  const ApartmentCollection = await Apartments();

  let newApartment = {
    ApartmentName: ApartmentName,
    streetAddress: streetAddress,
    rentPerMonth: rentPerMonth,
    rentDuration: rentDuration,
    maxResidents: maxResidents,
    numBedrooms: numBedrooms,
    numBathrooms: numBathrooms,
    laundry: laundry,
    floorNum: floorNum,
    roomNum: roomNum,
    appliancesIncluded: appliancesIncluded,
    maxPets: maxPets,
    utilitiesIncluded: utilitiesIncluded,
    reviews: [],
    overallRating: 0
  };
  const insertInfo = await ApartmentCollection.insertOne(newApartment);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw "Could not add Apartment";
  }
  const newId = insertInfo.insertedId.toString();
  const Apartment = await getApartmentById(newId);
  newApartment._id = newApartment._id.toString();
  return Apartment;
};

const getAllApartments = async () => {
  // if (arguments.length > 0) {
  //   throw "this function takes no parameters"
  // }
  const ApartmentCollection = await Apartments();
  const ApartmentList = await ApartmentCollection.find({}).toArray(); //?
  if (!ApartmentList) throw "Could not get all Apartments";

  ApartmentList.forEach((Apartment) => {
    Apartment._id = Apartment._id.toString();
  });
  return ApartmentList;
};

const getApartmentById = async (ApartmentId) => {
  // if (arguments.length > 1) {
  //   throw "Too many parameters passed"
  // }
  helpers.checkID(ApartmentId);
  apartmentId = ApartmentId.trim();
  const apartmentCollection = await Apartments();
  const newApartments = await apartmentCollection.findOne({
    _id: ObjectId(apartmentId),
  });
  if (newApartments === null) throw "No Apartment with that id";

  newApartments._id = newApartments._id.toString();
  newApartments.reviews.forEach((mov) => {
    mov._id = mov._id.toString();
  });
  return newApartments;
};

const removeApartment = async (apartmentId) => {
  helpers.checkID(apartmentId);
  apartmentId = apartmentId.trim();
  const apartmentCollection = await Apartments();
  let movName = await getApartmentById(apartmentId.toString());
  let mName = movName.title;
  const deletionInfo = await apartmentCollection.deleteOne({
    _id: ObjectId(apartmentId),
  });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete Apartment with id of ${apartmentId}`;
  }
  return `${mName} has been successfully deleted!`;
};

const updateApartment = async (
  apartmentId,
  apartmentName,
  streetAddress,
  rentPerMonth,
  rentDuration,
  maxResidents,
  numBedrooms,
  numBathrooms,
  laundry,
  floorNum,
  roomNum,
  appliancesIncluded,
  maxPets,
  utilitiesIncluded
) => {
  // if (arguments.length > 10) {
  //   throw "too many parameters are being passed"
  // }
  //!do not modify reviews or overallRating here
  helpers.checkString();
  helpers.checkString();
  helpers.checkArray();
  helpers.checkString();
  helpers.checkString();
  helpers.checkString();
  helpers.checkArray();
  helpers.checkString();
  helpers.checkString();

 
  helpers.checkID(apartmentId);
  helpers.checkTitle(title);
  helpers.checkStudio(studio);
  helpers.checkDirector(director);
  helpers.checkRating(rating);
  helpers.checkGenres(genres);
  helpers.checkCastMembers(castMembers);
  helpers.checkDateReleased(dateReleased);
  helpers.checkRuntime(runtime);
  const apartmentCollection = await apartments();
  const apartment = await getApartmentById(apartmentId);
  if (apartment === null) throw "no Apartment exists with that id";

  let updatedApartment = {
    ApartmentName: ApartmentName,
    streetAddress: streetAddress,
    rentPerMonth: rentPerMonth,
    rentDuration: rentDuration,
    maxResidents: maxResidents,
    numBedrooms: numBedrooms,
    numBathrooms: numBathrooms,
    laundry: laundry,
    floorNum: floorNum,
    roomNum: roomNum,
    appliancesIncluded: appliancesIncluded,
    maxPets: maxPets,
    utilitiesIncluded: utilitiesIncluded,
    reviews: apartment.reviews,
    overallRating: apartment.overallRating
  };
  const updateInfo = await apartmentCollection.replaceOne(
    { _id: ObjectId(apartmentId) },
    updatedApartment
  );
  const update = await getApartmentById(apartmentId);
  update._id = update._id.toString();

  return update;
};

const renameApartment = async (id, newName) => {
  //Not used for this lab
};

module.exports = {
  createApartment,
  getAllApartments,
  getApartmentById,
  removeApartment,
  updateApartment,
};
