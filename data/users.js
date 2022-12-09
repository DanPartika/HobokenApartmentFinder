const helpers = require("../helpers");
const { users } = require('../config/mongoCollections');
const bcrypt = require('bcrypt');
const { getApartmentById } = require("./apartments");
const saltRounds = 4;

const createUser = async (
  firstName,
  lastName,
  email,
  gender,
  age,
  username, 
  password
  ) => {
  //check if username exists
  let params = helpers.checkUserParameters(firstName, lastName, email, gender, age, username, password);
  const usersCollection = await users();
  const account = await usersCollection.findOne({ username: params.username });
  if (account !== null) throw `Account with username ${params.username} exists already.`;

  const UserEmail = await usersCollection.findOne({ email: params.email });
  if (UserEmail !== null) throw `Account with email ${params.email} exists already.`;

  const hash = await bcrypt.hash(params.password, saltRounds);
  //added a date created
  let today = new Date();
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  let yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;
  const newUser = {
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    gender: params.gender,
    age: params.age,
    userCreated: today,
    username: params.username,
    password: hash,
    userApartments: [],
    userReviews: []    
  }
  const insertInfo = await usersCollection.insertOne(newUser);
  if (! insertInfo.acknowledged || ! insertInfo.insertedId) throw 'Could not add user';
  const newId = insertInfo.insertedId.toString();
  const U = await getUser(params.username);
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
  username
) => {
  //!do not modify reviews or overallRating here
  //parms returns all the prams in a object with the trimmed output
  let params = helpers.checkUserParameters1(userID, firstName, lastName, email, gender, age, username);
  const usersCollection = await users();
  const user = await getUser(username);
  if (user === null) throw "no Apartment exists with that id";
  let updatedUser = {
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    gender: params.gender,
    age: params.age, 
    username: user.username,
    password: user.password,
    userApartments: user.userApartments,
    userReviews: user.userReviews   
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
  const deletionInfo = await usersCollection.deleteOne({ username: user.username });
  if (deletionInfo.deletedCount === 0) throw `Could not delete user with username of ${usersName}`;
  return `${usersName} has been successfully deleted!`; //what do i want to return?
};

const changeLogin = async (actualUsername, actualPassword, username, password) => { 
  const user = helpers.checkUsername(username)
  const pass = helpers.checkPassword(password)
  const collection = await users();
  const account = await collection.findOne({ username: actualUsername }); //find by username b/c that is a key in our data as is _id
  if (account === null) throw `${actualUsername} does not exist`
  try {
    const auth = checkUser(actualUsername, actualPassword);
  } catch (error) {
    throw error;
  }
  if (auth === null) throw 'cannot authencate username/password, please try again'
  if (! (await auth).authenticatedUser) throw "current username and password do not match current username and password"
  const hash = await bcrypt.hash(pass, saltRounds);
  let updatedUser = { 
    username: user,
    password: hash, //this line and above are the updates values
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    gender: params.gender,
    age: params.age,
    userApartments: user.userApartments,
    userReviews: user.userReviews  //redundant 
  };
  const updateInfo = await usersCollection.replaceOne( //replaceOne or updateOne
    { _id: ObjectId(id) },
    updatedUser
  );
  if(!updateInfo.acknowledged || updateInfo.matchedCount !== 1 || updateInfo.modifiedCount !== 1) throw "cannot update user"
  const update = await getUser(user);
  update._id = update._id.toString();
  return update;
};


module.exports = {createUser, checkUser, updateUser, getUser, removeUser, changeLogin};
