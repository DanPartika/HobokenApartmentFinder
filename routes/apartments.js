//require express and express router as shown in lecture code
//! to implement a map https://developers.google.com/maps/documentation/javascript/overview#maps_map_simple-javascript
const express = require("express");
const router = express.Router();
const data = require("../data");
const apartmentsData = data.Apartments;
const usersData = data.users
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");
const { getApartmentById, createApartment, getAllApartments, sortApartmentsBy, updateApartment, removeApartment } = require("../data/apartments");
const path = require('path');
const { addApartmentUser, updateApartmentUser, userRemoveReview, removeUserApartment } = require("../data/users");
const { getReview, incrementLikesReview } = require("../data/reviews");
const xss = require("xss");
//const { users, apartments } = require("../config/mongoCollections");


router.route("/") //homepage
  .get(async (req, res) => {
    //code here for GET
    //return res.sendFile(path.resolve('static/homepage.html'));
    try {
      if (req.session.user) return res.render('homepage',{title:"Hoboken Apartment Finder",user:req.session.user});
      else return res.render('homepage',{title:"Hoboken Apartment Finder"});
    } catch (error) {
      return res.render('error', {title: "Error", message: error})
    }
  });

router
  .route("/getReview/:id")
  .get(async (req, res) => {
    //make sure id exists
    try {
      if (req.session.user) {
        let reviewId = req.params.id;
        const review = await getReview(reviewId); //get the review        
        let aptId = "";

        //get all apts
        const apartments = await getAllApartments();

        //loop through their reviews
        for (let i = 0; i < apartments.length; i++) {
          for (let j = 0; j < apartments[i].reviews.length; j++) {
            //find the right aptid by matching the review id
            if(apartments[i].reviews[j]._id.toString() === reviewId.toString()) {
              aptId = apartments[i]._id;
              continue;
            }
          }
        }

        let likeReview = await incrementLikesReview(aptId, reviewId, req.session.user.username);
        //console.log(likeReview);
        //if(likeReview != 1) return res.render('error', {title:"Error", message: "could not increment like button"})

        //res.json(newReview.numLikes);
        res.json(likeReview);
        //res.redirect('/apartments/apartment/' + aptId);
      } else return res.redirect('/users/login');
    } catch (error) {
      return res.render('error', {title: error})
    }
  });

router
  .route("/apartments") //apt list
  .get(async (req, res) => {
    try {
      if (req.session.user) {
        let apts = [];
        if (req.query.sortByInput == null) apts = await getAllApartments();
        else apts = await sortApartmentsBy(req.query.sortByInput);
        const data = {apt:apts,user:req.session.user, sortedBy: req.query.sortByInput};
        return res.render('apartments/aptList', data);
      }
      else return res.redirect('/users/login');
    } catch (error) {
      return res.render('error',{title:error,user:req.session.user})
    }
   
  })
  .post(async (req, res) => {
    try {
      if (req.session.user) {
        return res.render('apartments/addApt',{user:req.session.user})
      } else {
        return res.render('userAccount/login',{user:req.session.user})
      }
    } catch (error) {
      return res.render('error',{title:error,user:req.session.user})
    }
  });

router
  .route("/apartments/sortedBy")
  .get(async (req,res) => {
    try {
      if (req.session.user) {
        return res.render('apartments/sortedAptList',{user:req.session.user, sortByInput:req.query.sortByInput})
      } else {
        return res.render('userAccount/login',{user:req.session.user})
      }
    } catch (error) {
      return res.render('error',{title:error,user:req.session.user})
    }
  })


router
  .route("/apartments/apartment/:apartmentId") //singular apt
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      try {
        const title = "Apartment Found";
        req.params.apartmentId = helpers.checkID(req.params.apartmentId);
        //let apt = {};
        try{
          const apt = await getApartmentById(req.params.apartmentId); 
          const tempData = {title: title, apt:apt,user:req.session.user};
          return res.render("apartments/apartment", tempData);
        } catch (error) {
          return res.status(400).render("error", {title: "Apartment Not Found", message: "400 Error: Apartment not found." + error,user:req.session.user});  // can alert this instead
        }
      } catch (e) {
        return res.status(404).render("error", {title: "Apartment Not Found", message: "404 Error: Page not found." + e,user:req.session.user});
      }
    } else {
      return res.render('userAccount/login', {user:req.session.user});
    }
  });


router
  .route("/apartments/add-new-apartment")
  .get(async (req,res) => {
    try {
      if (req.session.user) {
        return res.render('apartments/addApt',{user:req.session.user});
      } else {
        return res.render('userAccount/login',{user:req.session.user});
      }
    } catch (error) {
      return res.render('error',{title:error,user:req.session.user})
    }
    
  })
  .post(async (req,res) => {
    if (req.session.user) {
      // return res.render('apartments/addApt');
      try{
        let apartmentData = req.body;
        let apartmentName = xss(apartmentData.apartmentNameInput);
        let buildingNumber = xss(apartmentData.buildingNumberInput);
        let streetAdressInput = xss(apartmentData.streetAddressInput);
        let streetAddress = buildingNumber + " " + streetAdressInput + " Hoboken, NJ 07030";
        let rentPerMonth = xss(apartmentData.rentPerMonthInput);
        let rentDuration = xss(apartmentData.rentDurationInput);
        let maxResidents = xss(apartmentData.maxResidentsInput);
        let numBedrooms = xss(apartmentData.numBedroomsInput);
        let numBathrooms = xss(apartmentData.numBathroomsInput);
        let laundry = xss(apartmentData.laundryInput);
        if(laundry == "true") laundry = true
        else if(laundry == "false") laundry = false
        let floorNum = xss(apartmentData.floorNumInput);
        let roomNum = xss(apartmentData.roomNumInput);
        let appliancesIncluded = xss(apartmentData.appliancesIncludedInput);
        appliancesIncluded = appliancesIncluded.split(",");
        let maxPets = xss(apartmentData.maxPetsInput);
        if(maxPets == "true") maxPets = true
        else if(maxPets == "false") maxPets = false
        let utilitiesIncluded = xss(apartmentData.utilitiesIncludedInput);
        utilitiesIncluded = utilitiesIncluded.split(",")
        let file = xss(apartmentData.file);
        
        let aptId = await createApartment(req.session.user.username, apartmentName, streetAddress, rentPerMonth, rentDuration, maxResidents, numBedrooms, numBathrooms, laundry, floorNum, roomNum, appliancesIncluded, maxPets, utilitiesIncluded,file);
        let usersName = await addApartmentUser(aptId, req.session.user.username);
        let apt = getApartmentById(aptId);
        //return res.redirect('/apartments/apartment/uploadimage/:'+aptId);
        return res.render('apartments/uploadImage', {aptId:aptId});
        // let pathRedirect = '/apartments/apartment/' + aptId;
        // return res.redirect(pathRedirect);
      } catch (e) {
        return res.render('error',{title:"Error in creating apartment", message:e,user:req.session.user});
      }
    } else {
      return res.render('userAccount/login',{user:req.session.user});
    }
  })

  router
  .route("/apartments/apartment/uploadimage/:id")
  .post(async (req, res) => {

  });

  router
  .route("/apartments/editApartment/:apartmentId") //singular apt
  .get(async (req, res) => {
    try {
      if (req.session.user) {
        let apt = await getApartmentById(req.params.apartmentId);
        return res.render('apartments/editApt',{user:req.session.user, apt:apt});
      } else return res.render('userAccount/login',{user:req.session.user});
    } catch (error) {
      return res.render('error',{title:error,user:req.session.user})
    }
  })
  .post(async (req,res) => {
    if (req.session.user) {
      try {
        req.params.apartmentId.toString();
        let apt = await getApartmentById(req.params.apartmentId);
        if (!apt) throw `Apartment with id of ${req.params.apartmentId} does not exist`
        let apartmentData = req.body;
        let apartmentName = xss(apartmentData.apartmentNameInput); 
        let buildingNumber = xss(apartmentData.buildingNumberInput);
        let streetAdressInput = xss(apartmentData.streetAddressInput);
        let streetAddress = buildingNumber + " " + streetAdressInput + " Hoboken, NJ 07030";
        let rentPerMonth = xss(apartmentData.rentPerMonthInput);
        let rentDuration = xss(apartmentData.rentDurationInput);
        let maxResidents = xss(apartmentData.maxResidentsInput);
        let numBedrooms = xss(apartmentData.numBedroomsInput);
        let numBathrooms = xss(apartmentData.numBathroomsInput);
        let laundry = xss(apartmentData.laundryInput);
        if(laundry == "true") laundry = true
        else if(laundry == "false") laundry = false
        let floorNum = xss(apartmentData.floorNumInput);
        let roomNum = xss(apartmentData.roomNumInput);
        let appliancesIncluded = xss(apartmentData.appliancesIncludedInput);
        appliancesIncluded = appliancesIncluded.split(",");
        let maxPets = xss(apartmentData.maxPetsInput);
        if(maxPets == "true") maxPets = true
        else if(maxPets == "false") maxPets = false
        let utilitiesIncluded = xss(apartmentData.utilitiesIncludedInput);
        utilitiesIncluded = utilitiesIncluded.split(",")
        
        let newApt = await updateApartment(req.params.apartmentId, req.session.user.username, apartmentName, streetAddress, rentPerMonth, rentDuration, maxResidents, numBedrooms, numBathrooms, laundry, floorNum, roomNum, appliancesIncluded, maxPets, utilitiesIncluded);
        if (!newApt) throw `Could not update ${apartmentName} apartment with`
        let usersName = await updateApartmentUser(req.params.apartmentId, req.session.user.username);
        if (!usersName) throw `Could not update user with ${apartmentName} apartment`

        let pathRedirect = '/apartments/apartment/' + req.params.apartmentId;
        return res.redirect(pathRedirect); 
      } catch (e) {
        return res.render('error',{title:"Error in updating apartment", message:e,user:req.session.user});
      }
    } else {
      return res.render('userAccount/login',{user:req.session.user});
    }
  })

  router
    .route("/apartments/deleteApt/:apartmentId")
    .get(async (req,res) => {
      try {
        if (req.session.user) {
          return res.render('userAccount/userhomepage',{user:req.session.user});
        } else {
          return res.render('userAccount/login',{user:req.session.user});
        }
      } catch (error) {
        return res.render('error',{title:"Error in updating apartment", message:error,user:req.session.user});
      }
      
    })
    .post(async (req,res) => {
      try {
        if (req.session.user) {
          let apartmentId = req.params.apartmentId.trim();
          if (!apartmentId) return res.render('error', {title: "Id is not valid"}); //({ error: 'Invalid ObjectID' });
          try {
            
            let aptName = await getApartmentById(apartmentId);
            let apartReview = aptName.reviews;


            
            for(i in apartReview) {
              let username = apartReview[i].userName;
              let reviewId = apartReview[i]._id
              let removeUserApt =  await userRemoveReview(username, reviewId);
            }


            const userdata = await removeUserApartment(req.session.user.username, apartmentId);
            if (!userdata) throw `Could not remove apartment from user ${req.session.user.username}`
            
            const apartment = await removeApartment(apartmentId);
            if (!apartment) throw `Could not delete apartment with id of ${apartmentId}`
            
            //return res.render('userAccount/userhomepage',{user:req.session.user});
            return res.redirect('/users/protected')
          } catch (e) {
            return res.render('error', {title: "Error", message: e});
          }

          } else return res.render('userAccount/login',{user:req.session.user});

      } catch (error) {
        return res.render('error',{title:"Error in updating apartment", message:error,user:req.session.user});
      }
      
    })


module.exports = router;
