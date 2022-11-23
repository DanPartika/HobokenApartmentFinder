//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
const { ObjectId } = require("mongodb");
//const { Apartments } = require('./config/mongoCollections');

const checkStr = str => {
  if (!str) throw 'Please input a number.'
  if (typeof str !== 'string') throw ' Input a number.'
  const trimmed = str.trim()
  if (trimmed.length < 1) throw 'Input cannot be just spaces. Please input a number.'
  return trimmed
}

//accepts lists of strings
function checkArr(arr) {
  let arrInvalidFlag = false;
  if (!arr || !Array.isArray(arr)) throw "You must provide an array";
  if (arr.length === 0) return ["No additional information supplied"];
  // for (i in arr) {
  //   if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
  //     arrInvalidFlag = true;
  //     break;
  //   }
  //   arr[i] = checkStr(arr[i]);
  // }
  arr.forEach(str => {
    checkStr(str);
  });
  if (arrInvalidFlag) throw "One or more values is not a string or is an empty string";
  return arr;
}

function checkNum(num) {
  if (!num) throw "You must provide a valid number for your rating";
  if (isNaN(num)) throw `${num} must be a number`;
  if (num.toString().includes('.')) throw `${num} cannot include '.'`;
  if (num <= -1) throw "number must be positive";
  return num;
}

function checkID(id) {
  if (!id) throw "You must provide an id to search for";
  if (typeof id !== "string") throw "Id must be a string";
  if (id.trim().length === 0) throw "Id cannot be an empty string or just spaces";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "invalid object ID";
  return id;
}

//The Apartment complex/building name; can be N/A
function checkName(apartmentName) {
  if (apartmentName.length < 2) throw "title must be at least 2 characters";
  return checkStr(apartmentName);
}

//The street address of the specified apartment
function checkAddress(streetAddress) {
  //specify a format ## street name
  //if possible get all the streets in hoboken and make sure it is a street in hoboken
  return checkStr(streetAddress);
}

//
function checkRent(rentPerMonth) {
  if (!rentPerMonth) throw "You must provide a valid number for your rating";
  if (isNaN(rentPerMonth)) throw `${rentPerMonth} must be a number`;
  if (rentPerMonth.toString().includes('.')) throw `${rentPerMonth} cannot include '.'`; //!Shouldnt a price be a float value?
  if (rentPerMonth <= -1) throw "number must be positive";
  return ;
}

//
function checkRentDuration(rentDuration) {
  if ( !(/\d/.test(rentDuration) && /[a-zA-Z]/.test(rentDuration)) ) throw `${rentDuration} must contain a specified number of length`
  let rntDur = rentDuration.trim();
  return rntDur;
}

//
function checkResidents(maxResidents) {
  
  return checkNum(maxResidents);
}

//
function checkBedrooms(numBedrooms) {
  
  return checkNum(numBedrooms);
}

//
function checkBathrooms(numBathrooms) {
  
  return checkNum(numBathrooms);
}

//
function checkLaundry(laundry) {
  if (!laundry) throw "value for laundry must be supplied"
  if ( typeof laundry !== 'boolean' ) throw "laundry must be either true or false."
  return laundry;
}

//
function checkFloors(floorNum) {
  
  return checkNum(floorNum); //??possible error, this will throw on negative values
  /* possible fix
  try {
    return checkNum(floorNum)
  } catch (e) {
    if (checkNum < -5) throw "apt cannot be 5 floors underground"
    return floorNum
  }
  */
}

//
function checkRoomNum(roomNum) {
  //!can roomNum be a letter?
  return checkNum(roomNum);
}

//
function checkAppliances(appliancesIncluded) {
  
  return checkArr(appliancesIncluded);
}

//
function checkPets(maxPets) {
  
  return checkNum(maxPets); //type of pets?
}

//
function checkUtilities(utilitiesIncluded) {
  
  return checkArr(utilitiesIncluded);
}

//function that returns a object of all the trimmed parameters for apartments.js file
function checkParameters(apartmentName, streetAddress,rentPerMonth,rentDuration, maxResidents, numBedrooms, numBathrooms, laundry, floorNum, roomNum, appliancesIncluded, maxPets, utilitiesIncluded) {
  return { apartmentName: checkName(apartmentName),
  streetAddress: checkAddress(streetAddress),
  rentPerMonth: checkRent(rentPerMonth),
  rentDuration: checkRentDuration(rentDuration),
  maxResidents: checkResidents(maxResidents),
  numBedrooms: checkBedrooms(numBedrooms),
  numBathrooms: checkBathrooms(numBathrooms),
  laundry: checkLaundry(laundry),
  floorNum: checkFloors(floorNum),
  roomNum: checkRoomNum(roomNum),
  appliancesIncluded: checkAppliances(appliancesIncluded),
  maxPets: checkPets(maxPets),
  utilitiesIncluded: checkUtilities(utilitiesIncluded) };
}

/** FUNCTIONS USED FOR REVIEWS */
function checkReviewTitle(a) {
  if (!a) throw "must include a title";
  checkStr(a);
}

function checkReviewerName(a) {
  if (!a) throw "must include your name";
  checkStr(a);
}

function checkReview(a) {
  if (!a) throw "must include a review";
  checkStr(a);
}

function checkRating(a) {
  if (!a) throw "must include a rating";
  //checkNumber(a)
  if (isNaN(a)) throw "Must be a number from 1-5";
  if (a < 1 || a > 5) throw "Rating not in range 1-5";
}

function checkReviewsParameters(apartmentId,  userId, userName, comments, rating) {
  return {
    apartmentId: checkID(apartmentId), 
    userId: checkID(userId),
    userName: checkReviewerName(userName), 
    comments: checkReview(comments), 
    rating: checkRating(rating)
  }
}


module.exports = {
  checkStr,
  checkParameters,
  checkArr,
  checkNum,
  checkID,
  checkReviewsParameters
};
