//Daniel Partika
//I pledge my honor that I have abided by the Stevens Honors System.
const mongoCollections = require("../config/mongoCollections");
const apartments = mongoCollections.Apartments;
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");

const createApartment = async (
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
  let params = helpers.checkParameters(apartmentName, streetAddress,rentPerMonth,rentDuration, maxResidents, numBedrooms, numBathrooms, laundry, floorNum, roomNum, appliancesIncluded, maxPets, utilitiesIncluded);

  
  const apartmentCollection = await apartments();
  let curDate = new Date();

  let newApartment = {
    apartmentName: params.apartmentName,
    streetAddress: params.streetAddress,
    rentPerMonth: params.rentPerMonth,
    rentDuration: params.rentDuration,
    maxResidents: params.maxResidents,
    numBedrooms: params.numBedrooms,
    numBathrooms: params.numBathrooms,
    laundry: params.laundry,
    floorNum: params.floorNum,
    roomNum: params.roomNum,
    appliancesIncluded: params.appliancesIncluded,
    maxPets: params.maxPets,
    utilitiesIncluded: params.utilitiesIncluded,
    datePosted: curDate, //*Added a datePosted
    reviews: [],
    overallRating: 0
  };

  const insertInfo = await apartmentCollection.insertOne(newApartment);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw "Could not add Apartment";
  }
  const newId = insertInfo.insertedId.toString();
  const apt = await getApartmentById(newId);
  apt._id = apt._id.toString();
  return apt;
};

const getAllApartments = async () => {
  // if (arguments.length > 0) {
  //   throw "this function takes no parameters"
  // }
  const apartmentCollection = await apartments();
  const apartmentList = await apartmentCollection.find({}).toArray(); //?
  if (!apartmentList) throw "Could not get all Apartments";

  apartmentList.forEach((Apartment) => {
    Apartment._id = Apartment._id.toString();
  });
  return apartmentList;
};

const getApartmentById = async (apartmentId) => {
  // if (arguments.length > 1) {
  //   throw "Too many parameters passed"
  // }
  helpers.checkID(apartmentId);
  apartmentId = apartmentId.trim();
  const apartmentCollection = await apartments();
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
  const apartmentCollection = await apartments();
  let aptName = await getApartmentById(apartmentId.toString());
  let apartName = aptName.apartmentName;
  const deletionInfo = await apartmentCollection.deleteOne({
    _id: ObjectId(apartmentId),
  });
  if (deletionInfo.deletedCount === 0) throw `Could not delete Apartment with id of ${apartmentId}`;
  return `${apartName} has been successfully deleted!`;
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
  //parms returns all the prams in a object with the trimmed output
  let id = helpers.checkID(apartmentId);
  let params = helpers.checkParameters(apartmentName, streetAddress,rentPerMonth,rentDuration, maxResidents, numBedrooms, numBathrooms, laundry, floorNum, roomNum, appliancesIncluded, maxPets, utilitiesIncluded);
  const apartmentCollection = await apartments();
  const apartment = await getApartmentById(apartmentId);
  if (apartment === null) throw "no Apartment exists with that id";
  //todo add a modified date
  let curDate = new Date();
  let updatedApartment = {
    apartmentName: params.apartmentName,
    streetAddress: params.streetAddress,
    rentPerMonth: params.rentPerMonth,
    rentDuration: params.rentDuration,
    maxResidents: params.maxResidents,
    numBedrooms: params.numBedrooms,
    numBathrooms: params.numBathrooms,
    laundry: params.laundry,
    floorNum: params.floorNum,
    roomNum: params.roomNum,
    appliancesIncluded: params.appliancesIncluded,
    maxPets: params.maxPets,
    utilitiesIncluded: params.utilitiesIncluded,
    datePosted: curDate, //*Added a datePosted
    reviews: apartment.reviews,
    overallRating: apartment.overallRating
  };
  const updateInfo = await apartmentCollection.replaceOne(
    { _id: ObjectId(id) },
    updatedApartment
  );
  const update = await getApartmentById(id);
  update._id = update._id.toString();
  return update;
};

module.exports = {
  createApartment,
  getAllApartments,
  getApartmentById,
  removeApartment,
  updateApartment
};
