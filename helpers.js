//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
const { ObjectId } = require("mongodb");
//const { Apartments } = require('./config/mongoCollections');

function checkString(str) {
  if (!str) throw "You must provide a valid string";
  if (typeof str !== "string") throw "Value must be a string";
  if (str.trim().length === 0)
    throw "Value cannot be an empty string or string with just spaces";
}

function checkArray(arr) {
  let arrInvalidFlag = false;
  if (!arr || !Array.isArray(arr)) throw "You must provide an array";
  if (arr.length === 0) throw "You must supply at least one value in the array";
  for (i in arr) {
    if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
      arrInvalidFlag = true;
      break;
    }
    arr[i] = arr[i].trim();
  }
  if (arrInvalidFlag)
    throw "One or more values is not a string or is an empty string";
}

function checkNumber(num) {
  //console.log(typeof num + " " + isNaN(num))
  if (!num) throw "You must provide a valid number for your rating";
  if (isNaN(num)) {
    throw "value must be a number";
  }
  num = Math.round(num * 10) / 10;
  if (num < 1 || num > 5) {
    throw "number must be in range 1-5";
  }
}

function checkID(id) {
  if (!id) throw "You must provide an id to search for";
  if (typeof id !== "string") throw "Id must be a string";
  if (id.trim().length === 0)
    throw "Id cannot be an empty string or just spaces";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "invalid object ID";
}

function checkTitle(title) {
  if (title.length < 2) {
    throw "title must be at least 2 characters";
  }
  let Chars = /^[A-Za-z0-9\s]*$/;
  if (!Chars.test(title)) {
    throw "title must be a-z case insensitive or a number";
  }
}

function checkStudio(studio) {
  if (studio.length < 5) {
    throw "studio string must be at least 5 characters long";
  }
  let Chars = /^[A-Za-z\s]*$/;
  if (!Chars.test(studio)) {
    throw "studio must be a-z case insensitive";
  }
}

function checkDirector(director) {
  let directorArr = director.split(" ");
  if (directorArr.length != 2) {
    throw 'Name must be in format "first name space last name"';
  }
  let Chars = /^[A-Za-z'\s]*$/;
  if (directorArr[0].length < 3 || !Chars.test(directorArr[0])) {
    throw "Name in array: first name must be at least 3 characters each and only letters a-z or A-Z. No numbers or special characters or punctuation.";
  }
  if (directorArr[1].length < 3 || !Chars.test(directorArr[1])) {
    throw "Name in array: last name must be at least 3 characters each and only letters a-z or A-Z. No numbers or special characters or punctuation.";
  }
}

function checkRating(rating) {
  if (
    rating != "G" &&
    rating != "PG" &&
    rating != "PG-13" &&
    rating != "R" &&
    rating != "NC-17"
  ) {
    throw "rating must be one of the following: G, PG, PG-13, R, NC-17";
  }
}

function checkGenres(genres) {
  if (!genres || !Array.isArray(genres)) {
    throw "genres is incorrect format";
  }
  if (genres.length === 0) {
    throw "cannot pass empty array for genres";
  }
  for (let i = 0; i < genres.length; i++) {
    checkString(genres[i]);
    if (genres[i].length < 5) {
      throw "each genre must be at least 5 characters long";
    }
    let Chars = /^[A-Za-z\s]*$/;
    if (!Chars.test(genres[i])) {
      throw "Each genre must be a-z case insensitive or a number";
    }
  }
}

function checkCastMembers(castMembers) {
  if (!castMembers || !Array.isArray(castMembers)) {
    throw "CastMembers is incorrect format";
  }

  for (let i = 0; i < castMembers.length; i++) {
    checkString(castMembers[i]);
    let directorArr = castMembers[i].split(" ");
    if (directorArr.length != 2) {
      throw 'Cast member Name must be in format "first name space last name"';
    }
    let Chars = /^[A-Za-z'\s]*$/;
    if (directorArr[0].length < 3 || !Chars.test(directorArr[0])) {
      throw "Name in array: first name must be at least 3 characters each and only letters a-z or A-Z.";
    }
    if (directorArr[1].length < 3 || !Chars.test(directorArr[1])) {
      throw "Name in array: last name must be at least 3 characters each and only letters a-z or A-Z.";
    }
  }
}

function checkDateReleased(dateReleased) {
  //TODO: check yea is 1900 - 2024
  if (dateReleased.length != 10) {
    throw "dateReleased must be in the format mm/dd/yyyy";
  }
  let date = dateReleased.split("/");
  if (date[0] < 1 || date[1] < 1 || date[2] < 1900) {
    throw "invalid date, the earliest Apartment must be 1/1/1900";
  }
  if (date[2] > 2022 + 2) {
    throw "invalid date, the latest Apartment must be: this year + 2 (2024)";
  }
  let newDate = date[2] + "/" + date[0] + "/" + date[1];
  Date.prototype.isValid = function () {
    return this.getTime() === this.getTime();
  };
  let d = new Date(dateReleased);
  if (!d.isValid()) {
    throw "invalid date provided";
  }
  if (date[0] == 2 && date[1] > 28) {
    throw "invalid date: Feburary only has 28 days";
  }
  if (
    (date[0] == 4 || date[0] == 6 || date[0] == 9 || date[0] == 11) &&
    date[1] > 30
  ) {
    throw "the months of September, April, June, and November only have 30 days";
  }
}

function checkRuntime(runtime) {
  let time = runtime.split(" ");

  if (
    !time[0].endsWith("h") ||
    time[0].startsWith("0") ||
    !time[1].endsWith("min")
  ) {
    throw 'rumtime must be in format "#h #min"';
  }
  if (time[0].startsWith("-") || time[1].startsWith("-")) {
    throw "rumtime must not contain a negative";
  }
  let hour = time[0].split("h");
  let minutes = time[1].split("min");
  hour = parseInt(hour);
  minutes = parseInt(minutes);
  if (hour < 0) {
    throw "hours must be positive";
  }
  if (minutes < 0 || minutes > 59) {
    throw "minutes must be between 0-59";
  }

  if (hour < 1) {
    throw "minimum length of a Apartment must be 1 hour";
  }
}

function checkReviewTitle(a) {
  if (!a) {
    throw "must include a title";
  }
  checkString(a);
}
function checkReviewerName(a) {
  if (!a) {
    throw "must include your name";
  }
  checkString(a);
}
function checkReview(a) {
  if (!a) {
    throw "must include a review";
  }
  checkString(a);
}
function checkRating1(a) {
  if (!a) {
    throw "must include a rating";
  }
  //checkNumber(a)
  if (isNaN(a)) throw "Must be a number from 1-5";
  if (a < 1 || a > 5) throw "Rating not in range 1-5";
}
function checkApartmentId(a) {
  if (!a) {
    throw "must include ApartmentId";
  }
  checkString(a);
  checkID(a);
}

module.exports = {
  checkString,
  checkArray,
  checkNumber,
  checkID,
  checkTitle,
  checkStudio,
  checkDirector,
  checkRating,
  checkGenres,
  checkCastMembers,
  checkDateReleased,
  checkRuntime,
  checkReviewTitle,
  checkReviewerName,
  checkReview,
  checkRating1,
  checkApartmentId,
};
