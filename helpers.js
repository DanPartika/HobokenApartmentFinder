//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
const { ObjectId, ConnectionCheckOutStartedEvent } = require("mongodb");
//const { Apartments } = require('./config/mongoCollections');

function checkStr(str) {
  if (!str) throw 'Please input a number.'
  if (typeof str !== 'string') throw 'Input a number.'
  const trimmed = str.trim();
  if (trimmed.length < 1) throw 'Input cannot be just spaces.'
  return trimmed;
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
  if (!num) throw "You must provide a valid number. ";
  if (isNaN(num)) throw `${num} must be a number`;
  if (num.toString().includes('.')) throw `${num} cannot include '.'`;
  let n = parseInt(num);
  if (n <= -1) throw "number must be positive";
  return n;
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
  //!make sure this works with google map.
  //if possible get all the streets in hoboken and make sure it is a street in hoboken --> be solved with google maps
  return checkStr(streetAddress);
}

//
function checkRent(rentPerMonth) {
  if (!rentPerMonth) throw "You must provide a valid number.";
  if (isNaN(rentPerMonth)) throw `${rentPerMonth} must be a number`;
  if (rentPerMonth.toString().includes('.')) throw `${rentPerMonth} should be a whole number`;
  let rntPM = parseInt(rentPerMonth)
  if (rntPM <= -1) throw "Number must be positive";
  return rntPM;
}

//
function checkRentDuration(rentDuration) {
  if(!rentDuration) throw "must include rent duration"
  if ( !(/\d/.test(rentDuration)) ) throw `${rentDuration} must contain a specified number of length`
  let rntDur = rentDuration.trim();
  return checkNum(rntDur);
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
  if ( typeof laundry !== 'boolean' ) throw "laundry must be either true or false."
  if (laundry === null) throw "value for laundry must be supplied"
  return laundry;
}

//
function checkFloors(floorNum) {
  
  return checkNum(floorNum); //??possible error, this will throw on negative values?
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
  if (roomNum.length >= 4) throw "Room number cannot be that long"
  return checkStr(roomNum);
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
function checkApartmentParameters(apartmentName, streetAddress,rentPerMonth,rentDuration, maxResidents, numBedrooms, numBathrooms, laundry, floorNum, roomNum, appliancesIncluded, maxPets, utilitiesIncluded) {
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

function checkReviewerName(a) {
  if (!a) throw "must include your name";
  return checkStr(a);
}

function checkReview(a) {
  if (!a) throw "must include a review";
  return checkStr(a);
}

function checkRating(a) {
  if (!a) throw "must include a rating";
  //checkNumber(a)
  a = parseInt(a);
  if (isNaN(a)) throw "Must be a number from 1-5";
  if (a < 1 || a > 5) throw "Rating not in range 1-5";
  return a;
}

function checkReviewsParameters(apartmentId, userName, comments, rating) {
  return {
    apartmentId: checkID(apartmentId), 
    userName: checkReviewerName(userName), 
    comments: checkReview(comments), 
    rating: checkRating(rating)
  }
}

//FUNCTIONS FOR DATA/USERS.JS
function checkEmail(email) {
  if (! (email.includes("@") && email.includes(".")) ) throw "enter a vaild email";
  return checkStr(email);
}

function checkGender(gender){
  if (!gender) throw "must supply a gender"
  return checkStr(gender);
}

function checkAge(age) {
  age = checkNum(age)
  if (age < 18) throw "You must be atleast 18 years old"
  return age;
}

function checkCity(city) {
  
  return checkStr(city);
}

function checkState(state){

  return checkStr(state);
}

function checkUsername(username) {
  if (! username) throw 'Username does not exist.'
  if (typeof username !== 'string') throw 'Username is not a string.'
  const trimmed = username.trim();
  if (trimmed.length < 1) throw 'Username must contain at least 4 characters.'
  if (trimmed.length < 4) throw 'Username must be at least 4 characters long.'
  const regex = /^[0-9a-zA-Z]+$/ //regex that checks for a-z, 0-9 insensitive and no spaces
  if (! regex.test(trimmed)) throw 'Username can only contain only alphanumeric characters.'
  return trimmed.toLowerCase();
}

function checkPassword(password) {
  if (! password) throw 'Password does not exist.'
  if (typeof password !== 'string') throw 'Password must be a string.'
  const trimmed = password.trim();
  if (trimmed.length < 1) throw 'Password cannot be empty spaces.'
  if (trimmed.length < 6) throw 'Password must be at least 6 characters long.'
  let regex = /^\S*$/ //regex that checks if string contains any spaces
  if (! regex.test(trimmed)) throw 'password cannot contain spaces' 
  if (trimmed == trimmed.toLowerCase()) throw 'Password must contain at least 1 uppercase character.'
  regex = /[0-9]/ 
  if (! regex.test(trimmed)) throw 'Password must contain at least 1 number.'
  regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
  if (! regex.test(trimmed)) throw 'Password must contain at least 1 special character.'
  return trimmed;
}

function checkUserParameters(firstName, lastName, email, gender, age, username, password) {
  return {
    firstName:checkName(firstName), 
    lastName:checkName(lastName), 
    email:checkEmail(email), 
    gender: checkGender(gender), 
    age:checkAge(age), 
    username: checkUsername(username),
    password: checkPassword(password)
  }
}
function checkUserParameters1(userID, firstName, lastName, email, gender, age, userName){
  return {
    userID: checkID(userID),
    firstName:checkName(firstName), 
    lastName:checkName(lastName), 
    email:checkEmail(email), 
    gender: checkGender(gender), 
    age:checkAge(age),
    userName: checkUsername(userName)
  }
}


module.exports = {
  checkApartmentParameters,
  checkID,
  checkReviewsParameters,
  checkUserParameters,
  checkUserParameters1,
  checkUsername,
  checkPassword
};
