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
const { addApartmentUser, updateApartmentUser, addReviewUser, removeUserApartment } = require("../data/users");
const { getReview, incrementLikesReview } = require("../data/reviews");
const xss = require("xss");


router.route("/") //homepage
  .get(async (req, res) => {
    //code here for GET
    //return res.sendFile(path.resolve('static/homepage.html'));
    if (req.session.user) {
      return res.render('homepage',{title:"Hoboken Apartment Finder",user:req.session.user});
    } else {
      return res.render('homepage',{title:"Hoboken Apartment Finder"});
    }
    
  });

router
  .route("/getReview/:id")
  .get(async (req, res) => {
    //make sure id exists
    try {
      if (req.session.user) {
        console.log(req.params.id)
        let reviewId = req.params.id;
        const review = await getReview(reviewId); //get the review
        console.log("Review: " + review);
        let newReview = await incrementLikesReview(review.aptId, reviewId);
        console.log("newReview: " + JSON.stringify(newReview));
        //create a new data function that increments numlikes and stores in mongo
        res.json(newReview.numLikes);
      } else return res.redirect('/users/login');
    } catch (error) {
      res.render('error', {title: error})
    }
  });

router
  .route("/apartments") //apt list
  .get(async (req, res) => {
    try {
      if (req.session.user) {
        //if (apts.length == 0) return res.status(404).render("error",{title:"No Apartments Found", message: "Error code: 404, no apartments found"})
        let apts = [];
        if (req.query.sortByInput == null) apts = await getAllApartments();
        else apts = await sortApartmentsBy(req.query.sortByInput);

        const data = {apt:apts,user:req.session.user};
        return res.render('apartments/aptList', data);
      }
      else return res.redirect('/users/login');
    } catch (error) {
      return res.render('error',{title:error,user:req.session.user})
    }
   
  })
  .post(async (req, res) => {
    if (req.session.user) {
      return res.render('apartments/addApt',{user:req.session.user})
    } else {
      return res.render('userAccount/login',{user:req.session.user})
    }
  });

router
  .route("/apartments/sortedBy")
  .get(async (req,res) => {
    if (req.session.user) {
      // console.log(req.body)
      // console.log("===========\n" + req.query.sortByInput)
      return res.render('apartments/sortedAptList',{user:req.session.user, sortByInput:req.query.sortByInput})
    } else {
      return res.render('userAccount/login',{user:req.session.user})
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
        } catch (e) {
          return res.status(400).render("error", {title: "Apartment Not Found", message: "400 Error: Apartment not found.",user:req.session.user});  // can alert this instead
        }
        
      } catch (e) {
        
        return res.status(404).render("error", {title: "Apartment Not Found", message: "404 Error: Page not found.",user:req.session.user});
      }
    } else {
      return res.render('userAccount/login', {user:req.session.user});
    }
  });


router
  .route("/apartments/add-new-apartment")
  .get(async (req,res) => {
    if (req.session.user) {
      return res.render('apartments/addApt',{user:req.session.user});
    } else {
      return res.render('userAccount/login',{user:req.session.user});
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
        let HobokenStreets = ["Adams s", "Bloomfield s", "Castle Point Terrace","Clinton s", "Eighth s","Eleventh s",
        "Fifteenth s","Fifth s", "First s","Fourteenth s","Fourth s","Garden s","Grand s","Grove s","Harrison s","Henderson s",
        "Hudson P","Hudson S","Jackson s","Jefferson s","Madison s","Marshall s","Monroe s","Newark s","Ninth s","Observer h",
        "Park A","Paterson a","River s","River Terrace","Second s","Seventh s","Sinatra Drive","Sixteenth s",
        "Sixth s","Tenth s","Third s","Thirteenth s","Twelfth s","Vezzetti Way","Washington s","Willow a"];
        let checker = true;
        for (let i = 0; i < HobokenStreets.length; i++) 
          if (apartmentData.streetAddressInput.toLowerCase().includes(HobokenStreets[i].toLowerCase()) ) checker = false;
        if(checker) throw `${apartmentData.streetAddressInput} is not a valid street name in Hoboken.`;
      
        let apt = await createApartment(req.session.user.username, apartmentName, streetAddress, rentPerMonth, rentDuration, maxResidents, numBedrooms, numBathrooms, laundry, floorNum, roomNum, appliancesIncluded, maxPets, utilitiesIncluded);
        // if(!apt.overallRating == 0) return res.render('error',{title:"Error in creating apartment"});
        //console.log(apt)
        //todo check if adding apt failed.
        let usersName = await addApartmentUser(apt, req.session.user.username);
        
        //console.log(usersName)
        let pathRedirect = '/apartments/apartment/' + apt;
        //console.log(apt);
        res.redirect(pathRedirect);
      } catch (e) {
        return res.render('error',{title:"Error in creating apartment", message:e,user:req.session.user});
      }


    } else {
      return res.render('userAccount/login',{user:req.session.user});
    }
  })

  router
  .route("/apartments/editApartment/:apartmentId") //singular apt
  .get(async (req, res) => {
    if (req.session.user) {
      let apt = await getApartmentById(req.params.apartmentId);
      return res.render('apartments/editApt',{user:req.session.user, apt:apt});
    } else {
      return res.render('userAccount/login',{user:req.session.user});
    }
  })
  .post(async (req,res) => {
    if (req.session.user) {
      try {
        req.params.apartmentId.toString();
        let apt = await getApartmentById(req.params.apartmentId);
      
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
        let HobokenStreets = ["Adams s", "Bloomfield s", "Castle Point Terrace","Clinton s", "Eighth s","Eleventh s",
        "Fifteenth s","Fifth s", "First s","Fourteenth s","Fourth s","Garden s","Grand s","Grove s","Harrison s","Henderson s",
        "Hudson P","Hudson S","Jackson s","Jefferson s","Madison s","Marshall s","Monroe s","Newark s","Ninth s","Observer h",
        "Park A","Paterson a","River s","River Terrace","Second s","Seventh s","Sinatra Drive","Sixteenth s",
        "Sixth s","Tenth s","Third s","Thirteenth s","Twelfth s","Vezzetti Way","Washington s","Willow a"];
        let checker = true;
        for (let i = 0; i < HobokenStreets.length; i++) 
          if (apartmentData.streetAddressInput.toLowerCase().includes(HobokenStreets[i].toLowerCase()) ) checker = false;
        if(checker) throw `${apartmentData.streetAddressInput} is not a valid street name in Hoboken.`;
  
        req.params.apartmentId.toString();
        let newApt = await updateApartment(req.params.apartmentId, req.session.user.username, apartmentName, streetAddress, rentPerMonth, rentDuration, maxResidents, numBedrooms, numBathrooms, laundry, floorNum, roomNum, appliancesIncluded, maxPets, utilitiesIncluded);
        
        //let usersName = await updateApartmentUser(newApt._id, req.session.user.username);

        let pathRedirect = '/apartments/apartment/' + req.params.apartmentId;
        return res.redirect(pathRedirect); 
      }
     catch (e) {
      return res.render('error',{title:"Error in updating apartment", message:e,user:req.session.user});
    }
      
    } else {
      return res.render('userAccount/login',{user:req.session.user});
    }
  })

  router
    .route("/apartments/deleteApt/:apartmentId")
    .get(async (req,res) => {

      if (req.session.user) {
        return res.render('userAccount/userhomepage',{user:req.session.user});
      } else {
        return res.render('userAccount/login',{user:req.session.user});
      }
    })
    .post(async (req,res) => {
      req.params.apartmentId = req.params.apartmentId.trim();

      if (!ObjectId.isValid(req.params.apartmentId)) {
        res.render('error', {title: "Id is not valid"})//({ error: 'Invalid ObjectID' });
        return;
      }
      try {
        const apartment = await removeApartment(req.params.apartmentId);
        const userdata = await removeUserApartment(req.session.user.username, req.params.apartmentId);
        return res.render('userAccount/userhomepage',{user:req.session.user});
      } catch (e) {
        res.render('error', {title: "Error", message: e});
      }
    })

  // .delete(async (req, res) => {
  //   //code here for DELETE
  //   //!make sure user is logged in
  //   if (!req.params.ApartmentId) { 
  //     res.status(400).json({ error: "You must supply id to delete Apartment" });
  //     return;
  //   }

  //   req.params.ApartmentId = req.params.ApartmentId.trim();

  //   if (!ObjectId.isValid(req.params.ApartmentId)) {
  //     res.status(400).json({ error: "Invalid ObjectID" });
  //     return;
  //   }
  //   try {
  //     const deleted = await apartmentsData.removeApartment(
  //       req.params.ApartmentId
  //     );
  //     let del = { ApartmentId: req.params.ApartmentId, deleted: true };
  //     res.status(200).json(del);
  //   } catch (e) {
  //     res.status(404).json({ error: e });
  //     return;
  //   }
  // })

  


module.exports = router;