const helpers = require("../helpers");
const { users } = require('../config/mongoCollections');
const bcrypt = require('bcrypt');
const saltRounds = 16;

const createUser = async (
  firstName,
  lastName,
  email,
  gender,
  age,
  city,
  state, 
  username, 
  password
  ) => {
  //check if username exists
  let params = helpers.checkUserParameters(firstName, lastName, email, gender, age, city, state, username, password);
  const usersCollection = await users();
  const account = await usersCollection.findOne({ username: params.username });
  if (account !== null) throw `Account with username ${user} exists already.`;
  const hash = await bcrypt.hash(pass, saltRounds);
  //added a date created
  let curDate = new Date();
  const newUser = {
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    gender: params.gender,
    age: params.age,
    city: params.city,
    state: params.state,
    userCreated: curDate,
    userModified: [],
    username: params.username,
    password: hash,
    userApartments: [],
    userReviews: []    //isnt this redundant? I think remove userApartments b/c if we have review id we can get the list of apartments reviewed
  }
  const insertInfo = await usersCollection.insertOne(newUser);
  if (! insertInfo.acknowledged || ! insertInfo.insertedId) throw 'Could not add user';
  const newId = insertInfo.insertedId.toString();
  const U = await getApartmentById(newId);
  U._id = U._id.toString();
  return {insertedUser: true};
};

const checkUser = async (username, password) => { //login verfier
  const user = helpers.checkUsername(username)
  const pass = helpers.checkPassword(password)
  const collection = await users();
  const account = await collection.findOne({ username: user }); //find by username b/c that is a key in our data as is _id
  if (account === null) throw `Either the username or password is invalid`
  let match = false
  try {
    match = await bcrypt.compare(pass, account.password);
  } catch (e) {
      // failsafe for .compare function
  }
  if (!match) throw `Either the username or password is invalid`
  return {authenticatedUser: true};
};

const getUser = async (username) => {
  username = username.trim();
  const usersCollection = await users();
  const user = await usersCollection.findOne({username: username});
  if (user === null) throw "No user with that username found";
  user._id = user._id.toString();
  return user;
};

const updateUser = async (
  userID,
  firstName,
  lastName,
  email,
  gender,
  age,
  city,
  state,
  username
) => {
  // if (arguments.length > 10) {
  //   throw "too many parameters are being passed"
  // }
  //!do not modify reviews or overallRating here
  //parms returns all the prams in a object with the trimmed output
  let params = helpers.checkUserParameters1(userID, firstName, lastName, email, gender, age, city, state,  username, password);
  const usersCollection = await users();
  const user = await getUser(username);
  if (user === null) throw "no Apartment exists with that id";
  let curDate = new Date();
  let dates = [];
  if (user.userModified.length >= 1){
     dates = user.userModified;
     dates[dates.length] = curDate;
  } else {
    dates = [curDate];
  }
  let updatedUser = {
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    gender: params.gender,
    age: params.age,
    city: params.city,
    state: params.state,
    userCreated: user.userCreated,
    userModified: dates, //Note difference here 
    username:user.username,
    password:user.password,
    userApartments: user.userApartments,
    userReviews: user.userReviews  //redundant 
  };
  const updateInfo = await usersCollection.replaceOne(
    { _id: ObjectId(id) },
    updatedUser
  );
  if(!updateInfo.acknowledged || updateInfo.matchedCount !== 1 || updateInfo.modifiedCount !== 1) throw "cannot update user"
  const update = await getUser(username);
  update._id = update._id.toString();
  return update;
};

const removeUser = async (username) => {
  username = helpers.checkUsername(username);
  const usersCollection = await users();
  let user = await getUser(username.toString());
  let usersName = user.username;
  const deletionInfo = await usersCollection.deleteOne({ username: username });
  if (deletionInfo.deletedCount === 0) throw `Could not delete user with username of ${usersName}`;
  return `${usersName} has been successfully deleted!`; //what do i want to return?
};




module.exports = {createUser, checkUser, updateUser, getUser, removeUser};
